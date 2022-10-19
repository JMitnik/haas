import {
  PrismaClient,
  AutomationType,
  AutomationScheduled,
} from 'prisma/prisma-client';
import * as AWS from 'aws-sdk';
import { GraphQLYogaError } from '@graphql-yoga/node';

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
} from './AutomationService.helpers';
import ScheduledAutomationService from './ScheduledAutomationService';
import { EventBridgeService } from './EventBridgeService';

class AutomationService {
  automationPrismaAdapter: AutomationPrismaAdapter;
  dialogueService: DialogueService;
  userService: UserService;
  automationActionService: AutomationActionService;
  customerService: CustomerService;
  prisma: PrismaClient;
  lambda: AWS.Lambda;
  iam: AWS.IAM;
  scheduledAutomationService: ScheduledAutomationService;
  eventBridgeService: EventBridgeService;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.dialogueService = new DialogueService(prisma);
    this.automationActionService = new AutomationActionService(prisma);
    this.userService = new UserService(prisma);
    this.customerService = new CustomerService(prisma);
    this.scheduledAutomationService = new ScheduledAutomationService(prisma);
    this.prisma = prisma;
    this.eventBridgeService = new EventBridgeService()

    this.iam = new AWS.IAM();
    this.lambda = new AWS.Lambda();
  }

  /**
   * Deletes an automation as well as its related AWS resources
   * @param input
   * @returns the deleted automation
   */
  deleteAutomation = async (input: NexusGenInputs['DeleteAutomationInput']) => {
    const deleteAutomation = await this.automationPrismaAdapter.deleteAutomation(input);

    if (deleteAutomation.automationScheduledId) {
      await this.eventBridgeService.delete(deleteAutomation.automationScheduledId);
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
      await this.eventBridgeService.enable(enabledAutomation.automationScheduledId, input.state);
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
      const targets = await this.scheduledAutomationService.mapActionsToTargets(updatedAutomation)
      await this.eventBridgeService.upsert(updatedAutomation, targets);
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
        const targets = await this.scheduledAutomationService.mapActionsToTargets(createdAutomation);
        await this.eventBridgeService.upsert(createdAutomation, targets);
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
