import {
  PrismaClient,
  AutomationType,
  AutomationScheduled,
} from 'prisma/prisma-client';
import * as AWS from 'aws-sdk';

import { offsetPaginate } from '../general/PaginationHelpers';
import { NexusGenInputs } from '../../generated/nexus';
import DialogueService from '../questionnaire/DialogueService';
import UserService from '../users/UserService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import { AutomationActionService } from './AutomationActionService';
import CustomerService from '../../models/customer/CustomerService';
import {
  buildFrequencyCronString,
  getDayRange,
  constructUpdateAutomationInput,
  constructCreateAutomationInput,
  parseScheduleToCron,
} from './AutomationService.helpers';
import { WorkspaceWithRoles } from './AutomationService.types';
import { Automation } from './AutomationTypes';
import ScheduledAutomationService from './ScheduledAutomationService';
import { logger } from '../../config/logger';
import { GraphQLYogaError } from '@graphql-yoga/node';

class AutomationService {
  automationPrismaAdapter: AutomationPrismaAdapter;
  dialogueService: DialogueService;
  userService: UserService;
  automationActionService: AutomationActionService;
  customerService: CustomerService;
  prisma: PrismaClient;
  eventBridge: AWS.EventBridge;
  lambda: AWS.Lambda;
  iam: AWS.IAM;
  scheduledAutomationService: ScheduledAutomationService;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.dialogueService = new DialogueService(prisma);
    this.automationActionService = new AutomationActionService(prisma);
    this.userService = new UserService(prisma);
    this.customerService = new CustomerService(prisma);
    this.scheduledAutomationService = new ScheduledAutomationService(prisma);
    this.prisma = prisma;

    this.iam = new AWS.IAM();
    this.eventBridge = new AWS.EventBridge();
    this.lambda = new AWS.Lambda();
  }

  /**
   * Upserts an AWS EventBridge (and its targets) based on a scheduled automation.
   */
  upsertEventBridge = async (
    workspaceId: string,
    automationScheduled: AutomationScheduled,
    automation: Automation,
    dialogueId?: string
  ) => {
    const cronExpression = parseScheduleToCron(automationScheduled);

    // Find the state of the automation and adjust event bridge rule to that
    const state = automation?.isActive ? 'ENABLED' : 'DISABLED';

    // Get relevant parameters
    const workspace = await this.customerService.findWorkspaceById(workspaceId) as WorkspaceWithRoles;
    const dialogue = dialogueId ? await this.dialogueService.getDialogueById(dialogueId) : undefined;

    // If no bot user exists in the workspace => Create one
    let botUser = await this.userService.findBotByWorkspaceName(workspace.slug);
    if (!botUser) {
      await this.customerService.createBotUser(workspace.id, workspace.slug, workspace.roles);
      botUser = await this.userService.findBotByWorkspaceName(workspace.slug);
    };

    // Map actions to relevant Lambda ARNS for eventbridge to use as targets
    const ruleTargets = await this.scheduledAutomationService.mapActionsToTargets(
      automationScheduled.id,
      automation.automationScheduled?.actions || [],
      botUser!,
      workspace.slug,
      dialogue?.slug,
    );

    await this.eventBridge.putRule({
      Name: automationScheduled.id,
      ScheduleExpression: cronExpression,
      State: state,
    }).promise().catch((e) => {
      logger.error(`Unable to put EventBridge rule to automation ${automationScheduled.id}`, e);
      throw new GraphQLYogaError('Internal error');
    });

    await this.eventBridge.putTargets({
      Rule: automationScheduled.id,
      Targets: ruleTargets,
    }).promise().catch((e) => {
      logger.error(`Unable to add EventBridge targets to automation ${automationScheduled.id}`, e);
      throw new GraphQLYogaError('Internal error');
    });
  }

  /**
   * Deletes an automation as well as its related AWS resources
   * @param input
   * @returns the deleted automation
   */
  deleteAutomation = async (input: NexusGenInputs['DeleteAutomationInput']) => {
    const deleteAutomation = await this.automationPrismaAdapter.deleteAutomation(input);

    if (deleteAutomation.automationScheduledId) {
      // Disable in case removing fails for some reason so we don't create orphan rules which still run
      await this.eventBridge.disableRule({
        Name: deleteAutomation.automationScheduledId,
      }).promise();

      const targets = await this.eventBridge.listTargetsByRule({
        Rule: deleteAutomation.automationScheduledId,
      }).promise();

      const targetIds = targets.Targets?.map((target) => target.Id) || [];

      await this.eventBridge.removeTargets({
        Force: true,
        Rule: deleteAutomation.automationScheduledId,
        Ids: targetIds,
      }).promise();

      await this.eventBridge.deleteRule({
        Name: deleteAutomation.automationScheduledId,
      }).promise();
    }

    return deleteAutomation;
  }

  /**
   * Enables/Disables an automation
   * @param input an object containing the automation id as well as the state (true/false) of the automation
   */
  public enableAutomation = async (input: NexusGenInputs['EnableAutomationInput']) => {
    const enabledAutomation = await this.automationPrismaAdapter.enableAutomation(input);

    if (enabledAutomation.type === AutomationType.SCHEDULED && enabledAutomation.automationScheduledId) {
      if (input.state) {
        await this.eventBridge.enableRule({
          Name: enabledAutomation.automationScheduledId,
        }).promise().catch((e) => {
          logger.error('Unable to enable rule', e);
        })
      } else {
        await this.eventBridge.disableRule({
          Name: enabledAutomation.automationScheduledId,
        }).promise().catch((e) => {
          logger.error('Unable to disable rule', e);
        });
      }
    }

    return enabledAutomation;
  };

  /**
   * Updates an automation with the provided data after validating all
   * @param input object containing all information needed to update an automation
   * @returns updated Automation (without relationship fields)
   * @throws UserInputError if not all information is required
   */
  public updateAutomation = async (input: NexusGenInputs['CreateAutomationInput']) => {
    // Test whether input data matches what's needed to update an automation
    const validatedInput = constructUpdateAutomationInput(input);
    const updatedAutomation = await this.automationPrismaAdapter.updateAutomation(validatedInput);

    if (updatedAutomation.type === AutomationType.SCHEDULED
      && updatedAutomation.automationScheduled
    ) {
      await this.upsertEventBridge(
        input.workspaceId as string,
        updatedAutomation.automationScheduled,
        updatedAutomation,
        input.schedule?.dialogueId || undefined,
      );
    }

    return updatedAutomation;
  }

  /**
   * Creates an automation with the provided data after validating all
   * @param input object containing all information needed to create an automation
   * @returns created Automation (without relationship fields)
   * @throws UserInputError if not all information is required
   */
  public createAutomation = async (input: NexusGenInputs['CreateAutomationInput']) => {
    // Test whether input data matches what's needed to create an automation
    const validatedInput = constructCreateAutomationInput(input);

    const createdAutomation = await this.automationPrismaAdapter.createAutomation(validatedInput);

    try {
      if (createdAutomation.type === AutomationType.SCHEDULED
        && createdAutomation.automationScheduled
      ) {
        await this.upsertEventBridge(
          input.workspaceId as string,
          createdAutomation.automationScheduled,
          createdAutomation,
          input.schedule?.dialogueId || undefined,
        );
      }
    } catch {
      await this.automationPrismaAdapter.deleteAutomation({
        automationId: createdAutomation.id,
        workspaceId: createdAutomation.workspaceId,
      });
      throw new GraphQLYogaError('Failed to create an automation in cloud');
    }


    return createdAutomation;
  }

  /**
   * Finds an automation (and its relationships) by the provided ID
   * @param automationId the ID of the automation
   * @returns an Automation with relationships included or null if no automation with specified ID exist in the database
   */
  public findAutomationById = async (automationId: string) => {
    const automation = await this.automationPrismaAdapter.findAutomationById(automationId);
    const scheduledAutomation = automation?.automationScheduled;

    const newScheduledAutomation = automation?.automationScheduled ? {
      ...scheduledAutomation,
      time: `${scheduledAutomation?.minutes} ${scheduledAutomation?.hours}`,
      frequency: buildFrequencyCronString(scheduledAutomation as AutomationScheduled),
      dayRange: getDayRange(scheduledAutomation?.dayOfWeek as string),
    } : scheduledAutomation;

    return { ...automation, automationScheduled: newScheduledAutomation };
  }

  /**
   * Finds the workspace an automation is part of by the provided automation ID
   * @param automationId the id of an automation
   * @returns a workspace
   */
  public findWorkspaceByAutomation = (automationId: string) => {
    return this.automationPrismaAdapter.findWorkspaceByAutomationId(automationId);
  };

  /**
   * Finds all automations part of a workspace
   * @param workspaceId a workspace ID
   * @returns a list of automations part of a workspace
   */
  public findAutomationsByWorkspace = (workspaceId: string) => {
    return this.automationPrismaAdapter.findAutomationsByWorkspaceId(workspaceId);
  };

  /**
   * Function to paginate through all automations of a workspace
   * @param workspaceSlug the slug of the workspace
   * @param filter a filter object used to paginate through automations of a workspace
   * @returns a list of paginated automations
   */
  public paginatedAutomations = async (
    workspaceSlug: string,
    filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null,
  ) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const automations = await this.automationPrismaAdapter.findPaginatedAutomations(workspaceSlug, filter);
    const totalUsers = await this.automationPrismaAdapter.countAutomations(workspaceSlug, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalUsers, offset, perPage);

    return {
      automations: automations,
      totalPages,
      pageInfo,
    };
  };
}

export default AutomationService;
