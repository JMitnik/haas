import {
  AutomationAction,
  PrismaClient,
  AutomationActionType,
} from 'prisma/prisma-client';
import * as AWS from 'aws-sdk';

import { AWSServiceMap } from '../Common/Mappings/AWSServiceMap';
import config from '../../config/config';
import { dashboardDialogueUrl, workspaceDashboardUrl } from '../Common/Mappings/DashboardMappings.helpers';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import {
  buildFrequencyCronString,
  findReportQueryParamsByCron,
} from './AutomationService.helpers';
import { ScheduledAutomationPrismaAdapter } from './ScheduledAutomationPrismaAdapter';
import { Automation } from './AutomationTypes';
import { assertNonNullish } from '../../utils/assertNonNullish';
import { GenerateReportLambdaParams, SendDialogueLinkLambdaParams } from './AutomationService.types';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import UserPrismaAdapter from '../users/UserPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';

class ScheduledAutomationService {
  scheduledAutomationPrismaAdapter: ScheduledAutomationPrismaAdapter;
  automationPrismaAdapter: AutomationPrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  userPrismaAdapter: UserPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;
  prisma: PrismaClient;
  eventBridge: AWS.EventBridge;
  lambda: AWS.Lambda;
  iam: AWS.IAM;
  awsServiceMap: AWSServiceMap;

  constructor(prisma: PrismaClient) {
    this.scheduledAutomationPrismaAdapter = new ScheduledAutomationPrismaAdapter(prisma);
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prisma);
    this.userPrismaAdapter = new UserPrismaAdapter(prisma);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
    this.prisma = prisma;

    this.iam = new AWS.IAM();
    this.eventBridge = new AWS.EventBridge();
    this.lambda = new AWS.Lambda();
    this.awsServiceMap = new AWSServiceMap(process.env.AWS_ACCOUNT_ID as string, new AWS.Config())
  }

  /**
  * Finds the correct parameters for a specific lambda based on the AutomationActionType
  * @param type
  * @param generateLambdaParams
  * @param sendDialogueLinkParams
  * @returns a params object
  */
  private findLambdaParamsByActionType = (
    type: AutomationActionType,
    generateLambdaParams: GenerateReportLambdaParams,
    sendDialogueLinkParams: SendDialogueLinkLambdaParams,
  ) => {
    switch (type) {
      case AutomationActionType.SEND_DIALOGUE_LINK:
        return sendDialogueLinkParams;
      case AutomationActionType.WEEK_REPORT:
        return generateLambdaParams;
      case AutomationActionType.MONTH_REPORT:
        return sendDialogueLinkParams;
      case AutomationActionType.YEAR_REPORT:
        return generateLambdaParams;
      default:
        return generateLambdaParams;
    }
  }

  /**
* Maps the actions of a scheduled automation to valid AWS EventBridge rule targets.
*/
  public async mapActionsToTargets(
    automation: Automation,
  ): Promise<AWS.EventBridge.TargetList> {
    assertNonNullish(automation.automationScheduled, 'No scheduled automation found');
    const workspace = await this.customerPrismaAdapter.findWorkspaceById(automation.workspaceId);
    assertNonNullish(workspace, 'Cannot find workspace while updating automation');
    const botEmail = `${workspace.slug}@haas.live`
    const botUser = await this.userPrismaAdapter.getUserByEmail(botEmail);
    assertNonNullish(botUser, 'Cannot find bot user while updating automation');
    let dialogueSlug: string | undefined;

    if (automation?.automationScheduled?.dialogueId) {
      dialogueSlug = (await this.dialoguePrismaAdapter.getDialogueById(automation.automationScheduled.dialogueId))
        ?.slug;
    }

    const generalDLQ = this.awsServiceMap.getSQSResource(this.awsServiceMap.Report_Eventbridge_DLQName);

    return Promise.all(automation.automationScheduled.actions.map(async (action, index) => {
      const actionARN = this.getActionARN(action.type);

      const queryParams = await this.findReportQueryParamsByActionType(action);
      const reportUrl = dialogueSlug
        ? `${dashboardDialogueUrl(workspace.slug, dialogueSlug)}/_reports/weekly`
        : `${workspaceDashboardUrl(workspace.slug)}/_reports?type=${queryParams.type}`;

      const extraGenerateParams = {
        USER_ID: botUser.id,
        AUTOMATION_ACTION_ID: action.id,
        DASHBOARD_URL: 'NOT_USED_BUT_NEEDED_FOR_CHECK_IN_LAMBDA',
        REPORT_URL: reportUrl,
        API_URL: `${config.baseUrl}/graphql`,
        WORKSPACE_EMAIL: botUser.email,
        WORKSPACE_SLUG: workspace.slug,
        AUTHENTICATE_EMAIL: 'automations@haas.live',
      }

      const sendDialogueLinkParams = {
        AUTOMATION_SCHEDULE_ID: automation.automationScheduledId as string,
        AUTOMATION_ACTION_ID: action.id,
        AUTHENTICATE_EMAIL: 'automations@haas.live',
        API_URL: `${config.baseUrl}/graphql`,
        WORKSPACE_EMAIL: botUser.email,
        WORKSPACE_SLUG: workspace.slug,
      }

      // Lambda input is passed directly to
      const lambdaInput = this.findLambdaParamsByActionType(
        action.type,
        extraGenerateParams,
        sendDialogueLinkParams
      );

      return {
        Id: `${automation.automationScheduledId}-${index}-action`,
        Arn: actionARN,
        Input: JSON.stringify(lambdaInput),
        DeadLetterConfig: {
          Arn: generalDLQ,
        },
      }
    }))
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
   * Gets the appropriate ARN based on the action type.
   */
  private getActionARN(type: AutomationActionType) {
    switch (type) {
      case AutomationActionType.SEND_DIALOGUE_LINK:
        return this.awsServiceMap.getSNSResource(this.awsServiceMap.DialogueSender_SNS_PubTopic);
      case AutomationActionType.WEEK_REPORT:
        return this.awsServiceMap.getSNSResource(this.awsServiceMap.Report_SNS_PubTopic);
      case AutomationActionType.MONTH_REPORT:
        return this.awsServiceMap.getSNSResource(this.awsServiceMap.Report_SNS_PubTopic);
      case AutomationActionType.YEAR_REPORT:
        return this.awsServiceMap.getSNSResource(this.awsServiceMap.DialogueSender_SNS_PubTopic);
      default:
        return this.awsServiceMap.getSNSResource(this.awsServiceMap.DialogueSender_SNS_PubTopic);
    }
  }
}

export default ScheduledAutomationService;
