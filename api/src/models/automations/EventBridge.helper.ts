import * as AWS from 'aws-sdk';
import { AutomationAction, AutomationActionType, User } from 'prisma/prisma-client';
import { GraphQLYogaError } from '@graphql-yoga/node';

import { dashboardDialogueUrl, workspaceDashboardUrl } from '../Common/Mappings/DashboardMappings.helpers';
import { AWSServiceMap } from '../Common/Mappings/AWSServiceMap';
import config from '../../config/config';
import { logger } from '../../config/logger';
import { assertNonNullish } from '../../utils/assertNonNullish';

import {
  AutomationWithSchedule,
  GenerateReportLambdaParams,
  SendDialogueLinkLambdaParams,
} from './AutomationService.types';
import {
  buildFrequencyCronString, findReportQueryParamsByCron, parseScheduleToCron,
} from '../automations/AutomationService.helpers';

export class EventBridge {
  private eventBridge: AWS.EventBridge;
  private awsServiceMap: AWSServiceMap;

  constructor(public automation: AutomationWithSchedule) {
    this.eventBridge = new AWS.EventBridge();
    this.awsServiceMap = new AWSServiceMap(process.env.AWS_ACCOUNT_ID as string, new AWS.Config());
  }

  public async delete() {
    assertNonNullish(this.automation.automationScheduledId, 'No scheduled automation available!');
    await this.eventBridge.disableRule({
      Name: this.automation.automationScheduledId,
    }).promise();

    const targets = await this.eventBridge.listTargetsByRule({
      Rule: this.automation.automationScheduledId,
    }).promise();

    const targetIds = targets.Targets?.map((target) => target.Id) || [];

    await this.eventBridge.removeTargets({
      Force: true,
      Rule: this.automation.automationScheduledId,
      Ids: targetIds,
    }).promise();

    await this.eventBridge.deleteRule({
      Name: this.automation.automationScheduledId,
    }).promise();
  }

  public async enable(state: boolean) {
    assertNonNullish(this.automation.automationScheduledId, 'No scheduled automation available!');
    if (state) {
      await this.eventBridge.enableRule({
        Name: this.automation.automationScheduledId,
      }).promise().catch((e) => {
        logger.error('Unable to enable rule', e);
      })
    } else {
      await this.eventBridge.disableRule({
        Name: this.automation.automationScheduledId,
      }).promise().catch((e) => {
        logger.error('Unable to disable rule', e);
      });
    }
  }

  /**
   * Upserts an AWS EventBridge (and its targets) based on a scheduled automation.
   */
  public upsert = async (
    botUser: User,
    workspaceSlug: string,
    dialogueSlug?: string,
  ) => {
    assertNonNullish(this.automation.automationScheduled, 'No scheduled automation available!');
    assertNonNullish(this.automation.automationScheduledId, 'No scheduled automation available!');

    const cronExpression = parseScheduleToCron(this.automation.automationScheduled);
    // Find the state of the automation and adjust event bridge rule to that
    const state = this.automation?.isActive ? 'ENABLED' : 'DISABLED';

    // Map actions to relevant Lambda ARNS for eventbridge to use as targets
    const ruleTargets = await this.mapActionsToTargets(
      this.automation.automationScheduledId,
      this.automation.automationScheduled?.actions || [],
      botUser,
      workspaceSlug,
      dialogueSlug,
    );

    await this.eventBridge.putRule({
      Name: this.automation.automationScheduledId,
      ScheduleExpression: cronExpression,
      State: state,
    }).promise().catch((e) => {
      logger.error(`Unable to put EventBridge rule to automation ${this.automation.automationScheduledId}`, e);
      throw new GraphQLYogaError('Internal error');
    });

    await this.eventBridge.putTargets({
      Rule: this.automation.automationScheduledId,
      Targets: ruleTargets,
    }).promise().catch((e) => {
      logger.error(`Unable to add EventBridge targets to automation ${this.automation.automationScheduledId}`, e);
      throw new GraphQLYogaError('Internal error');
    });
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

  /**
   * Finds the query params used for the report page based on an automation action type
   * @param automationAction
   * @returns an object containing info on the type of the report as well as date range
   */
  private async findReportQueryParamsByActionType(automationAction: AutomationAction) {
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
        const frequency = buildFrequencyCronString(this.automation.automationScheduled!);
        return findReportQueryParamsByCron(frequency)
    }
  }

  /**
  * Maps the actions of a scheduled automation to valid AWS EventBridge rule targets.
  */
  private async mapActionsToTargets(
    automationScheduledId: string,
    actions: AutomationAction[],
    botUser: User,
    workspaceSlug: string,
    dialogueSlug?: string,
  ): Promise<AWS.EventBridge.TargetList> {
    const generalDLQ = this.awsServiceMap.getSQSResource(this.awsServiceMap.Report_Eventbridge_DLQName);

    return Promise.all(actions.map(async (action, index) => {
      const actionARN = this.getActionARN(action.type);

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

      // Lambda input is passed directly to
      const lambdaInput = this.findLambdaParamsByActionType(
        action.type,
        extraGenerateParams,
        sendDialogueLinkParams
      );

      return {
        Id: `${automationScheduledId}-${index}-action`,
        Arn: actionARN,
        Input: JSON.stringify(lambdaInput),
        DeadLetterConfig: {
          Arn: generalDLQ,
        },
      }
    }))
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
}