import {
  AutomationAction,
  PrismaClient,
  AutomationActionType,
  Customer,
  Role,
  User,
  UserOfCustomer,
} from '@prisma/client';
import * as AWS from 'aws-sdk';

import { AWSServiceMap } from '../Common/Mappings/AWSServiceMap';
import config from '../../config/config';
import DialogueService from '../questionnaire/DialogueService';
import UserService from '../users/UserService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import { AutomationActionService } from './AutomationActionService';
import CustomerService from '../../models/customer/CustomerService';
import {
  buildFrequencyCronString,
  findLambdaArnByAction,
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
  awsServiceMap: AWSServiceMap;

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
    this.awsServiceMap = new AWSServiceMap(process.env.AWS_ACCOUNT_ID as string, new AWS.Config())
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
   * Maps the actions of a scheduled automation to valid AWS EventBridge rule targets.
   */
  public async mapActionsToTargets(
    automationScheduledId: string,
    actions: AutomationAction[],
    // TODO: Not scalable type, need to establish this as a core type
    botUser: (User & {
      customers: (UserOfCustomer & {
        customer: Customer;
        role: Role;
        user: User;
      })[];
    }),
    workspaceSlug: string,
    dialogueSlug?: string,
  ): Promise<AWS.EventBridge.TargetList> {
    const generalDLQ = this.awsServiceMap.getSQSResource(this.awsServiceMap.Report_Eventbridge_DLQName);

    return Promise.all(actions.map(async (action, index) => {
      const lambdaTargetArn = findLambdaArnByAction(action.type);
      if (!lambdaTargetArn) throw new GraphQLYogaError('No lambda target arn found in env file');
      const dashboardUrl = config.dashboardUrl;

      const queryParams = await this.findReportQueryParamsByActionType(action);
      const reportUrl = dialogueSlug
        ? `${dashboardUrl}/dashboard/b/${workspaceSlug}/d/${dialogueSlug}/_reports/weekly`
        : `${dashboardUrl}/dashboard/b/${workspaceSlug}/_reports?type=${queryParams.type}`;

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

      // Lambda input is passed directly to
      const lambdaInput = findLambdaParamsByActionType(
        action.type,
        extraGenerateParams,
        sendDialogueLinkParams
      );

      return {
        Id: `${automationScheduledId}-${index}-action`,
        Arn: lambdaTargetArn,
        Input: JSON.stringify(lambdaInput),
        DeadLetterConfig: {
          Arn: generalDLQ,
        },
      }
    }))
  }
}

export default ScheduledAutomationService;
