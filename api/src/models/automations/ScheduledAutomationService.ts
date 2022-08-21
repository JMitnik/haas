import {
  AutomationAction,
  PrismaClient,
  AutomationActionType,
} from '@prisma/client';
import * as AWS from 'aws-sdk';

import config from '../../config/config';
import DialogueService from '../questionnaire/DialogueService';
import UserService from '../users/UserService';
import { User } from '../users/User.types';
import { dashboardDialogueUrl, workspaceDashboardUrl } from '../Common/Mappings/DashboardMappings.helpers';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import { AutomationActionService } from './AutomationActionService';
import CustomerService from '../../models/customer/CustomerService';
import {
  buildFrequencyCronString,
  findLambdaArnByActionType,
  findLambdaParamsByActionType,
  findReportQueryParamsByCron,
} from './AutomationService.helpers';
import { GraphQLYogaError } from '@graphql-yoga/node';
import { ScheduledAutomationPrismaAdapter } from './ScheduledAutomationPrismaAdapter';

class ScheduledAutomationService {
  scheduledAutomationPrismaAdapter: ScheduledAutomationPrismaAdapter;
  automationPrismaAdapter: AutomationPrismaAdapter;
  dialogueService: DialogueService;
  userService: UserService;
  automationActionService: AutomationActionService;
  customerService: CustomerService;
  prisma: PrismaClient;
  eventBridge: AWS.EventBridge;
  lambda: AWS.Lambda;
  iam: AWS.IAM;

  constructor(prisma: PrismaClient) {
    this.scheduledAutomationPrismaAdapter = new ScheduledAutomationPrismaAdapter(prisma);
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.dialogueService = new DialogueService(prisma);
    this.automationActionService = new AutomationActionService(prisma);
    this.userService = new UserService(prisma);
    this.customerService = new CustomerService(prisma);
    this.prisma = prisma;

    this.iam = new AWS.IAM();
    this.eventBridge = new AWS.EventBridge();
    this.lambda = new AWS.Lambda();
  }

  /**
   * Finds a scheduled automation by its ID
   * @param scheduledAutomationId
   * @returns An AutomationScheduled entry with all its actions and respective channels
   */
  findScheduledAutomationById = (scheduledAutomationId: string) => {
    return this.scheduledAutomationPrismaAdapter.findScheduledAutomationById(scheduledAutomationId);
  }

  /**
   * Finds the query params used for the report page based on an automation action type
   * @param automationAction
   * @returns an object containing info on the type of the report as well as date range
   */
  findReportQueryParamsByActionType = async (automationAction: AutomationAction) => {
    switch (automationAction.type) {
      case AutomationActionType.WEEK_REPORT:
        return {
          type: 'weekly',
        }
      case AutomationActionType.MONTH_REPORT:
        return {
          type: 'monthly',
        }
      case AutomationActionType.YEAR_REPORT:
        return {
          type: 'yearly',
        }
      default: // Customizeable Report
        const scheduledAutomation = await this.findScheduledAutomationById(automationAction.automationScheduledId!);
        const frequency = buildFrequencyCronString(scheduledAutomation!);
        return findReportQueryParamsByCron(frequency)
    }
  }

  /**
   * Maps the actions of a scheduled automation to valid AWS EventBridge rule targets
   * @returns a list of targets for an AWS EventBridge rule
   */
  mapActionsToRuleTargets = async (
    automationScheduledId: string,
    actions: AutomationAction[],
    botUser: User,
    workspaceSlug: string,
    dialogueSlug?: string,
  ): Promise<AWS.EventBridge.TargetList> => {
    return Promise.all(actions.map(async (action, index) => {
      const lambdaTargetArn = findLambdaArnByActionType(action.type);
      if (!lambdaTargetArn) throw new GraphQLYogaError('No lambda target arn found in env file');

      const queryParams = await this.findReportQueryParamsByActionType(action);
      const reportUrl = dialogueSlug
        ? `${dashboardDialogueUrl(workspaceSlug, dialogueSlug)}/_reports/weekly`
        : `${workspaceDashboardUrl(workspaceSlug)}/_reports?type=${queryParams.type}`;

      const extraGenerateParams = {
        USER_ID: botUser.id,
        AUTOMATION_ACTION_ID: action.id,
        DASHBOARD_URL: 'NOT_USED_BUT_NEEDED_FOR_CHECK_IN_LAMBDA',
        REPORT_URL: reportUrl,
        API_URL: `${config.baseUrl}/graphql`,
        WORKSPACE_EMAIL: botUser.email,
        WORKSPACE_SLUG: workspaceSlug,
        AUTHENTICATE_EMAIL: 'automations@haas.live',
      }

      const sendDialogueLinkParams = {
        AUTOMATION_SCHEDULE_ID: automationScheduledId,
        AUTOMATION_ACTION_ID: action.id,
        AUTHENTICATE_EMAIL: 'automations@haas.live',
        API_URL: `${config.baseUrl}/graphql`,
        WORKSPACE_EMAIL: botUser.email,
        WORKSPACE_SLUG: workspaceSlug,
      }

      const finalInput = findLambdaParamsByActionType(action.type, extraGenerateParams, sendDialogueLinkParams);

      return {
        Id: `${automationScheduledId}-${index}-action`,
        Arn: lambdaTargetArn,
        Input: JSON.stringify(finalInput),
      }
    }))
  }
}

export default ScheduledAutomationService;