import {
  AutomationAction,
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  NodeType,
  PrismaClient,
  QuestionAspect,
  OperandType,
  AutomationActionType,
  AutomationConditionBuilderType,
  AutomationType,
  AutomationScheduled,
  Automation,
  Customer,
  Role,
  User,
  UserOfCustomer,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { ApolloError, UserInputError } from 'apollo-server-express';
import * as AWS from 'aws-sdk';

import config from '../../config/config';
import { offsetPaginate } from '../general/PaginationHelpers';
import { NexusGenInputs } from '../../generated/nexus';
import DialogueService from '../questionnaire/DialogueService';
import UserService from '../users/UserService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import AutomationConditionBuilderService from './AutomationConditionBuilderService';
import {
  AutomationCondition,
  AutomationTrigger,
  BuilderEntry,
  CheckedConditions,
  CreateAutomationConditionInput,
  CreateAutomationConditionScopeInput,
  CreateAutomationInput,
  CreateConditionOperandInput,
  PreValidatedConditions,
  SetupQuestionCompareDataInput,
  SetupQuestionCompareDataOutput,
  UpdateAutomationInput,
} from './AutomationTypes'
import { AutomationActionService } from './AutomationActionService';
import { GenerateReportPayload } from 'models/users/UserServiceTypes';
import CustomerService from '../../models/customer/CustomerService';

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

  constructor(prisma: PrismaClient) {
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
   * Maps the actions of a scheduled automation to valid AWS EventBridge rule targets
   * @param automationScheduledId the id of a scheduled automation
   * @param actions a list of automation actions
   * @param botUser the bot user of a workspace
   * @param workspaceSlug the slug of a workspace
   * @param dialogueSlug the slug of a dialogue
   * @returns a list of targets for an AWS EventBridge rule
   */
  mapActionsToRuleTargets = (
    automationScheduledId: string,
    actions: AutomationAction[],
    botUser: (User & {
      customers: (UserOfCustomer & {
        customer: Customer;
        role: Role;
        user: User;
      })[];
    }),
    workspaceSlug: string,
    dialogueSlug?: string,
  ): AWS.EventBridge.TargetList => {
    return actions.map((action, index) => {
      const lambdaTargetArn = action.type === AutomationActionType.GENERATE_REPORT
        ? process.env.GENERATE_REPORT_LAMBDA_ARN as string
        : process.env.SEND_DIALOGUE_LINK_LAMBDA_ARN as string;

      const dashboardUrl = config.dashboardUrl;

      // TODO: Create a workspace scoped url instead dialogue scoped url when no dialogueSlug provided
      const reportUrl = `${dashboardUrl}/dashboard/b/${workspaceSlug}/d/${dialogueSlug}/_reports/weekly`;

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
        AUTHENTICATE_EMAIL: 'automations@haas.live',
        API_URL: `${config.baseUrl}/graphql`,
        WORKSPACE_EMAIL: botUser.email,
        WORKSPACE_SLUG: workspaceSlug,
      }

      const finalInput = action.type === AutomationActionType.GENERATE_REPORT
        ? extraGenerateParams
        : sendDialogueLinkParams;

      return {
        Id: `${automationScheduledId}-${index}-action`,
        Arn: lambdaTargetArn,
        Input: JSON.stringify(finalInput),
      }
    })
  }

  /**
   * Upserts an AWS EventBridge (and its targets) based on a scheduled automation
   * @param workspaceId 
   * @param automationScheduled a scheduled automation
   * @param parentAutomation the parent automation the scheduled automation is connected to
   * @param dialogueId 
   */
  upsertEventBridge = async (
    workspaceId: string,
    automationScheduled: AutomationScheduled,
    parentAutomation: Automation & {
      automationScheduled: (AutomationScheduled & {
        actions: AutomationAction[];
      }) | null;
    },
    dialogueId?: string
  ) => {
    const { minutes, hours, dayOfMonth, dayOfWeek, month } = automationScheduled;

    // Transform the CRON expression to one supported by AWS (? indicator is not part of cron-validator)
    const scheduledExpression = `cron(${minutes} ${hours} ${dayOfMonth === '*' ? '?' : dayOfMonth} ${month} ${dayOfWeek} *)`

    // Find the state of the automation and adjust event bridge rule to that
    const state = parentAutomation?.isActive ? 'ENABLED' : 'DISABLED';

    const workspace = await this.customerService.findWorkspaceById(workspaceId) as Customer;
    const dialogue = dialogueId ? await this.dialogueService.getDialogueById(dialogueId) : undefined;

    const user = await this.userService.findBotByWorkspaceName(workspace.slug);

    await this.eventBridge.putRule({
      Name: automationScheduled.id,
      ScheduleExpression: scheduledExpression,
      State: state,
      RoleArn: process.env.EVENT_BRIDGE_RUN_ALL_LAMBDAS_ROLE_ARN,
    }).promise().catch((e) => {
      console.log(`upserting a event bridge rule for automation schedule: ${automationScheduled.id} with error ${e}`)
      throw new ApolloError(`upserting a event bridge rule for automation schedule: ${automationScheduled.id} with error ${e}`)
    });

    await this.eventBridge.putTargets({
      Rule: automationScheduled.id,
      Targets: this.mapActionsToRuleTargets(
        automationScheduled.id,
        parentAutomation.automationScheduled?.actions || [],
        user!,
        workspace.slug,
        dialogue?.slug,
      ),
    }).promise().catch((e) => {
      throw new ApolloError(`upserting targets automation schedule: ${automationScheduled.id} with error ${e}`)
    });;

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
   * Validates all conditions in a condition builder (including its nested condition builders)
   * @param builderId ID of the root condition builder
   * @returns a boolean indicating whether conditions have passed or not
   */
  validateConditionBuilder = async (builderId: string): Promise<boolean> => {
    const conditionBuilder = await this.automationPrismaAdapter.findAutomationConditionBuilderById(builderId);
    const destructedData = await this.destructureBuilder(conditionBuilder as BuilderEntry);
    const validatedObjects = await this.validateConditions(destructedData, {});
    console.log('Validated Objects: ', validatedObjects);

    const builderConditionsPassed = AutomationConditionBuilderService.checkConditions(validatedObjects);
    console.log('Builder condition passed: ', builderConditionsPassed)
    return builderConditionsPassed;
  };

  /**
   * Restructures conditions in builder (and its nested builders) in a format more easily looped over when validating conditions
   * e.g. 
   * { 
   *  AND: [
   *    condition1,
   *    {
   *      OR: [
   *        condition2,
   *        condition3
   *      ]
   *    }
   *  ]
   * }
   * @param dataObj an empty object
   * @param entry an AutomationConditionBuilder entry with conditions and nested conditionBuilder
   * @returns An object containing a list of conditions with either AND/OR as its property as well as nested objects containing conditions
   */
  destructureBuilder = async (entry: BuilderEntry) => {
    const dataObj = {} as any;
    // If there are any conditions available for a builder entry add them to a list with the type (AND/OR) as its property
    if (entry.conditions.length) {
      dataObj[entry.type] = [
        ...entry.conditions,
      ]
    }

    if (entry.childConditionBuilderId) {
      const child = await this.findAutomationConditionBuilder(entry.childConditionBuilderId);

      if (!child) throw new Error('Has childConditioBuilderId but cannot find the entry in DB!');

      // If nested condition builder exist recursively run this function again and add its contents to list
      const des = await this.destructureBuilder(child);
      dataObj[entry.type].push(des)
    }

    return dataObj;
  }

  /**
   * Validates conditions of a child builder based on its type (AND/OR)
   * @param data an Object containing a list AutomationConditions and optionally an nested object containing additional conditions
   * @param checkedObject an Object containing the results of previously validated conditions
   * @returns An object containing the results (booleans) of all conditions
   */
  validateConditions = async (data: PreValidatedConditions, checkedObject: CheckedConditions) => {
    const isAND = !!data['AND'];
    const type = isAND ? 'AND' : 'OR' as keyof CheckedConditions;
    const conditions = data[type] as (PreValidatedConditions | AutomationCondition)[];

    // Check if AND/OR property exist on object storing results
    const andOrOr = Object.keys(checkedObject).find((property) => (
      property === 'AND' || property === 'OR'
    )) as keyof CheckedConditions | undefined;

    // If AND/OR property doesn't exist on object storing result
    // => Add the property with an empty array
    if (!andOrOr) {
      checkedObject[type] = [];
    }

    await Promise.all(conditions.map(async (entry) => {
      // If entry is an AutomationCondition => validate whether condition is true or not
      if ((entry as AutomationCondition)?.id) {
        const validated = await this.testTriggerCondition(entry as AutomationCondition);
        const finalType = andOrOr || type;
        checkedObject[finalType]?.push(validated);
      } else {
        // If entry is a nested object => Run this function recursively and add validated results to existing object
        const childIsAnd = (entry as PreValidatedConditions)?.AND ? { AND: [] } : { OR: [] };
        const validated = await this.validateConditions(entry as PreValidatedConditions, childIsAnd);
        checkedObject[type]?.push(validated);
      }
    }));

    return checkedObject;
  }

  /**
   * Finds automation condition builder by its ID
   * @param builderId the ID of a condition builder
   * @returns a condition builder
   */
  findAutomationConditionBuilder = (builderId: string) => {
    return this.automationPrismaAdapter.findAutomationConditionBuilderById(builderId);
  };

  /**
   * Finds automation condition by its ID
   * @param automationConditionId the ID of an automation condition
   * @returns an automation condition
   */
  findAutomationConditionById = (automationConditionId: string) => {
    return this.automationPrismaAdapter.findAutomationConditionById(automationConditionId);
  };

  /**
   * Sets up the data necessary for comparing slider data with the condition match value
   * @param input object containing
   * @returns an object containing the value to be compared, the match value it should be checked against and total entries
   */
  setupSliderCompareData = async (
    input: SetupQuestionCompareDataInput
  ): Promise<SetupQuestionCompareDataOutput | undefined> => {
    const { questionId, aspect, aggregate, operands } = input;
    const scopedSliderNodeEntries = await this.automationPrismaAdapter.aggregateScopedSliderNodeEntries(
      questionId,
      aspect,
      aggregate
    );
    const aggregatedAverageValue = scopedSliderNodeEntries.aggregatedValues._avg?.value;
    const operand = operands?.[0]?.numberValue;

    return {
      compareValue: aggregatedAverageValue,
      operand,
      totalEntries: scopedSliderNodeEntries.totalEntries,
    }
  }

  /**
  * Sets up the data necessary for comparing choice data with the condition match value
  * @param input object containing data needed to aggregate and operand data.
  * Object *MUST* contain 2 operands:
  * - One of type INT (the amount to check against)
  * - One of type STRING (the option value to check against)
  * @returns an object containing the value to be compared, the match value it should be checked against and total entries
  */
  setupChoiceCompareData = async (
    input: SetupQuestionCompareDataInput
  ): Promise<SetupQuestionCompareDataOutput | undefined> => {
    let compareValue: number | null = null;
    const { questionId, aspect, aggregate, operands } = input;
    const scopedChoiceNodeEntries = await this.automationPrismaAdapter.aggregateScopedChoiceNodeEntries(
      questionId,
      aspect,
      aggregate
    );

    console.log('Scoped choice node entries: ', scopedChoiceNodeEntries);
    console.log('Operands: ', operands);
    const amountOperand = operands.find((operand) => operand.type === OperandType.INT);
    const textOperand = operands.find((operand) => operand.type === OperandType.STRING)?.textValue;

    if (textOperand) {
      compareValue = Object.keys(scopedChoiceNodeEntries.aggregatedValues).find(
        (key) => key === textOperand
      ) ? scopedChoiceNodeEntries.aggregatedValues[textOperand] : 0;
    }

    return {
      // if matchValue doesn't exist that's a condition problem -> returning null.
      // if key doesn't exist in scopedChoiceNodeEntries.aggregatedValues -> returning 0.
      compareValue: textOperand ? compareValue : null,
      operand: amountOperand?.numberValue,
      totalEntries: scopedChoiceNodeEntries.totalEntries,
    }
  }

  /**
  * Sets up the data necessary for comparing question data with the condition match value
  * @param input object containing
  * @returns an object containing the value to be compared, the match value it should be checked against and total entries
  */
  setupQuestionCompareData = async (
    input: SetupQuestionCompareDataInput
  ): Promise<SetupQuestionCompareDataOutput | undefined> => {
    console.log('Input setup question compare: ', input);
    switch (input.type) {
      case NodeType.SLIDER: {
        return this.setupSliderCompareData(input);
      }

      case NodeType.CHOICE: {
        return this.setupChoiceCompareData(input);
      }

      default: {
        return undefined;
      }
    }
  };

  /**
   * Validates question condition scope.
   *
   * @param condition an AutomationCondition
   * @return boolean. true if conditions are met and false if they ar enot
   */
  validateQuestionScopeCondition = async (condition: AutomationCondition) => {
    const input: SetupQuestionCompareDataInput = {
      type: condition.question?.type as NodeType,
      questionId: condition?.question?.id as string,
      operands: condition.operands,
      aggregate: condition.questionScope?.aggregate,
      aspect: condition.questionScope?.aspect as QuestionAspect,
    };
    // Fetch data based on scope
    const scopedData = await this.setupQuestionCompareData(input);
    // Some of the data necessary to validate condition is missing
    if (
      !scopedData ||
      (!scopedData?.compareValue && typeof scopedData?.compareValue !== 'number')
      || !scopedData?.operand
    ) {
      console.log('Some of the data necessary to validate condition is missing. Returning false');
      return false;
    }

    // Want latest X but there is less than X *new* entries in the database => return false
    // TODO: Add this batch option to event instead of condition
    const hasNotEnoughLatest = (
      condition.questionScope?.aggregate?.latest &&
      scopedData.totalEntries % condition.questionScope?.aggregate?.latest !== 0
    );

    console.log('Has not enough latest: ', hasNotEnoughLatest);

    if (hasNotEnoughLatest) {
      return false;
    }

    switch (condition.operator) {
      case AutomationConditionOperatorType.SMALLER_OR_EQUAL_THAN: {
        return scopedData.compareValue <= scopedData.operand;
      }

      // Because it passed the above batch test this one will always be true
      case AutomationConditionOperatorType.EVERY_N_TH_TIME: {
        return true;
      }

      case AutomationConditionOperatorType.GREATER_OR_EQUAL_THAN: {
        return scopedData.compareValue >= scopedData.operand;
      }

      case AutomationConditionOperatorType.GREATER_THAN: {
        return scopedData.compareValue > scopedData.operand;
      }

      case AutomationConditionOperatorType.SMALLER_THAN: {
        return scopedData.compareValue < scopedData.operand;
      }

      case AutomationConditionOperatorType.IS_EQUAL: {
        console.log(scopedData.compareValue, '===', scopedData.operand)
        return scopedData.compareValue === scopedData.operand;
      }

      case AutomationConditionOperatorType.IS_NOT_EQUAL: {
        return scopedData.compareValue !== scopedData.operand;
      }

      // TODO: Implement
      case AutomationConditionOperatorType.INNER_RANGE: {
        return false;
      }

      // TODO: Implement
      case AutomationConditionOperatorType.OUTER_RANGE: {
        return false;
      }

      default: {
        throw Error('No checks in place for provided operator type!');
      }
    }
  }

  /**
   * Tests a condition of an AutomationTrigger based on its scope
   * @param condition an AutomationCondition
   * @returns boolean. true if condition passes, false if condition fails.
   */
  testTriggerCondition = (condition: AutomationCondition) => {
    switch (condition.scope) {
      case AutomationConditionScopeType.QUESTION: {
        return this.validateQuestionScopeCondition(condition);
      }

      case AutomationConditionScopeType.DIALOGUE: {
        return false;
      }

      default: {
        return false;
      }
    }
  }

  /**
   * Checks conditions of a potentially triggered automation
   * @param automationTriggers a list of potentially triggered automations
   * @returns boolean whether all conditions of an automation trigger pass
   */
  testTriggerConditions = async (automationTrigger: AutomationTrigger) => {
    const matchedConditionsTriggers = await Promise.all(
      automationTrigger.conditionBuilder.conditions.map(async (condition) => this.testTriggerCondition(condition))
    );

    const successfullyPassedAllConditions = !matchedConditionsTriggers.includes(false);
    return successfullyPassedAllConditions;
  }

  /**
   * Runs an action lambda based on the specified AutomationActionType
   * @param automationAction an Prisma AutomationAction object
   * @param workspaceSlug the slug of the workspace the automation belongs to
   * @param dialogueSlug the slug of the pertaining dialogue (OPTIONAL)
   * @returns the succesfull running of a SNS related to the action
   */
  public handleAutomationAction = async (
    automationAction: AutomationAction,
    workspaceSlug: string,
    dialogueSlug?: string
  ) => {
    switch (automationAction.type) {
      case AutomationActionType.GENERATE_REPORT: {
        const payload = (automationAction.payload as unknown) as GenerateReportPayload;

        const users = await this.userService.findTargetUsers(workspaceSlug, payload);
        const emailAddresses = users.map((user) => user.user.email);

        return this.automationActionService.generateReport(
          automationAction.id,
          workspaceSlug,
          emailAddresses,
          dialogueSlug,
        );
      };

      default: {
        console.log(`No action handler implemented for action type: ${automationAction.type}. abort.`);
        return new Promise((resolve) => resolve(''));
      }
    };
  }

  /**
   * Checks whether any candidate trigger automations with an event related to a dialogue (or its questions).
   * @param dialogueId a dialogue id
   * @returns a list of automation triggers potentially triggered
   */
  getCandidateTriggers = async (dialogueId: string) => {
    const questions = await this.dialogueService.getQuestionsByDialogueId(dialogueId);
    const questionIds = questions.map((question) => question.id).filter(isPresent);
    const candidateAutomations = await this.automationPrismaAdapter.findCandidateAutomations(
      dialogueId,
      questionIds
    );

    if (!candidateAutomations.length) return null;

    const candidateAutomationTriggers = candidateAutomations.map((automation) => {
      const dialogueSlug = (
        automation.automationTrigger?.event.dialogue?.slug ||
        automation.automationTrigger?.event.question?.questionDialogue?.slug
      );

      return {
        dialogueSlug,
        workspaceSlug: automation.workspace.slug,
        trigger: automation.automationTrigger,
      }
    }).filter(isPresent);

    return candidateAutomationTriggers;
  }

  /**
   * See if any trigger automations are applicable now.
   *
   * Preconditions:
   * - Must be called for now in SessionService.createSession. We currently have no checks that ensure the automation
   *   is called once per "batch" of sessions. For example, if we call the `handleTriggerAutomations` function twice in
   *   a row without creating a new session, it will simply perform the same actions.
   * @param dialogueId
   * @returns
   */
  handleTriggerAutomations = async (dialogueId: string) => {
    const candidateAutomations = await this.getCandidateTriggers(dialogueId);
    if (!candidateAutomations) {
      console.log('No potential trigger automations found. abort');
      return;
    }

    const triggeredAutomations = await Promise.all(candidateAutomations.map(async (automationTrigger) => {
      const { trigger, workspaceSlug, dialogueSlug } = automationTrigger;

      if (!trigger) return null;

      const allConditionsConfirmed = await this.validateConditionBuilder(trigger.automationConditionBuilderId);

      if (allConditionsConfirmed) {
        await Promise.all(trigger?.actions?.map((automationAction) => {
          return this.handleAutomationAction(automationAction, workspaceSlug, dialogueSlug)
        }));

        console.log('All conditions of automation trigger confirmed. Do action');
      } else {
        console.log('One or more conditions have failed. No action done');
      }
    }));

    return triggeredAutomations;
  }

  /**
   * Validates the condition scope input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param condition input object for an AutomationConditionScope
   * @returns a validated AutomationConditionScope input object where it is sure specific fields exist
   * @throws UserInputError if not all information is required
   */
  validateCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): Required<NexusGenInputs['CreateAutomationCondition']> => {
    if (!condition.scope) throw new UserInputError('One of the automation conditions has no scope object provided!');
    const { type, dialogueScope, workspaceScope, questionScope } = condition.scope;
    if (!type) throw new UserInputError('One of the automation conditions has no scope type provided!');

    switch (condition.scope.type) {
      case AutomationConditionScopeType.QUESTION: {
        if (!questionScope?.aspect) {
          throw new UserInputError('Condition scope is question but no aspect is provided!');
        }
        if (!questionScope?.aggregate?.type) {
          throw new UserInputError('Condition scope is question but no aggregate type is provided!');
        }

        break;
      }

      case AutomationConditionScopeType.DIALOGUE: {
        if (!dialogueScope?.aspect) throw new UserInputError('Condition scope is dialogue but no aspect is provided!');

        if (!dialogueScope?.aggregate?.type) throw new UserInputError('Condition scope is dialogue but no aggregate type is provided!');

        break;
      };

      case AutomationConditionScopeType.WORKSPACE: {
        if (!workspaceScope?.aspect) throw new UserInputError('Condition scope is workspace but no aspect is provided!');

        if (!workspaceScope?.aggregate?.type) throw new UserInputError('Condition scope is workspace but no aggregate type is provided!');

        break;
      }

      default: {
        break;
      }
    }

    return condition as Required<NexusGenInputs['CreateAutomationCondition']>;;
  }

  /**
   * Constructs a CREATE prisma condition scope data object
   * @param condition input object for an AutomationConditionScope
   * @returns a CREATE prisma condition scope data object
   */
  constructCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): CreateAutomationConditionScopeInput => {
    const validatedCondition = this.validateCreateAutomationConditionScopeInput(condition);

    return {
      ...validatedCondition.scope,
      type: validatedCondition.scope?.type,
    } as CreateAutomationConditionScopeInput;
  }

  hasEmptyTargetList = (payload: any): boolean => {
    if (!payload) return true;
    const targetsProperty = Object.entries(payload).find((entry) => entry[0] === 'targets') as [string, Array<string>] | undefined;
    return targetsProperty ? targetsProperty[1].length === 0 : true;
  }

  /**
   * Validates data input for automation actions
   * @param input
   * @returns validated CREATE prisma automation actions data list
   */
  validateAutomationActionsInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['actions'] => {
    if (input?.actions?.length === 0) throw new UserInputError('No actions provided for automation!');

    input.actions?.forEach((action) => {
      const hasNoTarget = action.payload ? (Object.entries(action.payload).length === 0
        || !Object.keys(action.payload).find((key) => key === 'targets')
        || this.hasEmptyTargetList(action.payload)) : true;

      switch (action.type) {
        case undefined: {
          throw new UserInputError('No action type provided for automation action!');
        }

        case null: {
          throw new UserInputError('No action type provided for automation action!');
        }

        case AutomationActionType.SEND_EMAIL: {
          if (hasNoTarget) throw new UserInputError('No target email addresses provided for "SEND_EMAIL"!');
          return;
        }

        case AutomationActionType.SEND_SMS: {
          if (hasNoTarget) throw new UserInputError('No target phone numbers provided for "SEND_SMS"!');
          return;
        }

        default: {
          return;
        }
      }
    });

    return input.actions as CreateAutomationInput['actions'];
  }

  /**
   * Validates the AutomationAction input list provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a list with AutomationAction input entries
   * @returns a validated AutomationAction input list where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  constructAutomationActionsInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['actions'] => {
    const validatedActions = this.validateAutomationActionsInput(input);
    return validatedActions;
  }

  /**
   * Validates the AutomationCondition input list provided by checking the existence of fields could be potentially undefined or null
   * @param input object containing a list with AutomationCondition input entries
   * @returns a validated AutomationCondition input list
   * @throws UserInputError if not all information is required
   */
  validateCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationInput']): Required<NexusGenInputs['CreateAutomationCondition'][]> => {
    if (input.conditionBuilder?.conditions?.length === 0) throw new UserInputError('No conditions provided for automation');

    input.conditionBuilder?.conditions?.forEach((condition) => {
      if (!condition.operator) {
        throw new UserInputError('No operator type is provided for a condition');
      }
      if (condition.operands?.length === 0) throw new UserInputError('No match values provided for an automation condition!');
      condition.operands?.forEach((operand) => {
        if (!operand.operandType) {
          throw new UserInputError('No match value type was provided for a condition!');
        }
      });
    });

    return input.conditionBuilder?.conditions as Required<NexusGenInputs['CreateAutomationCondition'][]>;
  }

  constructBuilderRecursive = (input: NexusGenInputs['AutomationConditionBuilderInput']): CreateAutomationInput['conditionBuilder'] => {
    let mappedConditions: CreateAutomationConditionInput[] = [];
    let childConditionBuilder;

    if (input.conditions?.length) {
      mappedConditions = input.conditions.map((condition) => {
        return {
          ...condition,
          operator: condition.operator as Required<AutomationConditionOperatorType>,
          scope: this.constructCreateAutomationConditionScopeInput(condition),
          operands: condition.operands?.map((operand) => {
            const { dateTimeValue, operandType, numberValue, textValue, id } = operand;

            return {
              id,
              dateTimeValue,
              numberValue,
              textValue,
              type: operandType,
            }
          }) as Required<CreateConditionOperandInput[]> || [],
        }
      }) || [];
    }

    if (input.childConditionBuilder) {
      childConditionBuilder = this.constructBuilderRecursive(input.childConditionBuilder);
    }

    const finalObject: UpdateAutomationInput['conditionBuilder'] = {
      id: input.id || undefined,
      conditions: mappedConditions,
      type: input.type as Required<AutomationConditionBuilderType>,
      childBuilder: childConditionBuilder,
    }

    return finalObject;
  }

  /**
   * Validates the AutomationCondition input list provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a list with AutomationCondition input entries
   * @returns a validated AutomationCondition input list where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  constructCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['conditions'] => {
    const validatedConditions = this.validateCreateAutomationConditionsInput(input) as Required<NexusGenInputs['CreateAutomationCondition'][]>;

    const mappedConditions: CreateAutomationInput['conditions'] = validatedConditions?.map((condition) => {
      return {
        ...condition,
        operator: condition.operator as Required<AutomationConditionOperatorType>,
        scope: this.constructCreateAutomationConditionScopeInput(condition),
        operands: condition.operands?.map((operand) => {
          const { dateTimeValue, operandType, numberValue, textValue } = operand;

          return {
            dateTimeValue,
            numberValue,
            textValue,
            type: operandType,
          }
        }) as Required<CreateConditionOperandInput[]> || [],
      }
    }) || [];

    return mappedConditions;
  }

  /**
   * Validates the AutomationEvent input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a AutomationEvent input entry
   * @returns a validated AutomationEvent input object where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  constructCreateAutomationEventInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['event'] => {
    if (!input.event) throw new UserInputError('No event provided for automation!');
    if (!input.event?.eventType || typeof input.event?.eventType === undefined || input.event?.eventType === null) throw new UserInputError('No event type provided for automation event!');

    return {
      ...input.event,
      eventType: input.event.eventType,
    }
  }

  /**
    Validates the Automation input object for CREATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to create an automation
   * @returns a validated Automation input object where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  validateCreateAutomationInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput => {
    if (!input) throw new UserInputError('No input provided create automation with!');
    if (!input.label || typeof input.label === undefined || input.label === null) throw new UserInputError('No label provided for automation!');

    if (!input.automationType) throw new UserInputError('No automation type provided for automation!');
    if (!input.workspaceId) throw new UserInputError('No workspace Id provided for automation!');
    return input as Required<CreateAutomationInput>;
  }

  /**
   * Constructs the Automation prisma data object for CREATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to create an automation
   * @returns a validated Automation prisma data object
   * @throws UserInputError if not all information is required
   */
  constructCreateAutomationInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput => {
    const validatedInput = this.validateCreateAutomationInput(input);

    const label: CreateAutomationInput['label'] = validatedInput.label;
    const workspaceId: CreateAutomationInput['workspaceId'] = validatedInput.workspaceId;
    const automationType: CreateAutomationInput['automationType'] = validatedInput.automationType;
    const conditions: CreateAutomationInput['conditions'] = automationType === AutomationType.TRIGGER ? this.constructCreateAutomationConditionsInput(input) : undefined;

    const builderInput = automationType === AutomationType.TRIGGER ? input.conditionBuilder as Required<NexusGenInputs['AutomationConditionBuilderInput']> : undefined;
    const conditionBuilder: CreateAutomationInput['conditionBuilder'] = builderInput ? this.constructBuilderRecursive(builderInput) : undefined;
    const event: CreateAutomationInput['event'] = this.constructCreateAutomationEventInput(input);
    const schedule: CreateAutomationInput['schedule'] = input?.schedule
      ? {
        dayOfMonth: input.schedule.dayOfMonth,
        dayOfWeek: input.schedule.dayOfWeek,
        hours: input.schedule.hours,
        minutes: input.schedule.minutes,
        month: input.schedule.month,
        type: input.schedule.type,
        id: input.schedule?.id || undefined,
        dialogueScope: input.schedule.dialogueId ? {
          connect: {
            id: input.schedule.dialogueId,
          },
        } : undefined,
      }
      : undefined;

    const actions: CreateAutomationInput['actions'] = this.constructAutomationActionsInput(input);

    return {
      label,
      workspaceId,
      automationType,
      conditions,
      event,
      actions,
      description: input.description,
      conditionBuilder,
      schedule,
    }
  }

  /**
   * Validates the Automation input object for UPDATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to update an automation
   * @returns a validated Automation input object containing all information necessary to update an Automation
   * @throws UserInputError if not all information is required
   */
  constructUpdateAutomationInput = (input: NexusGenInputs['CreateAutomationInput']): UpdateAutomationInput => {
    if (!input.id) throw new UserInputError('No ID provided for automation that should be updated!');
    if (input.automationType === AutomationType.TRIGGER && !input.conditionBuilder?.id) throw new UserInputError('No ID provided for the root condition builder');

    const id: UpdateAutomationInput['id'] = input.id;
    const createInput = this.constructCreateAutomationInput(input);
    return { ...createInput, id: id }
  }

  /**
   * Enables/Disables an automation 
   * @param input an object containing the automation id as well as the state (true/false) of the automation
   */
  public enableAutomation = async (input: NexusGenInputs['EnableAutomationInput']) => {
    const enabledAutomation = await this.automationPrismaAdapter.enableAutomation(input);

    if (enabledAutomation.type === AutomationType.SCHEDULED && enabledAutomation.automationScheduledId) {
      input.state
        ? await this.eventBridge.enableRule({ Name: enabledAutomation.automationScheduledId }).promise()
          .catch((e) => console.log(e))
        : await this.eventBridge.disableRule({ Name: enabledAutomation.automationScheduledId }).promise()
          .catch((e) => console.log(e));
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
    const validatedInput = this.constructUpdateAutomationInput(input);
    const updatedAutomation = await this.automationPrismaAdapter.updateAutomation(validatedInput);

    if (updatedAutomation.type === AutomationType.SCHEDULED && updatedAutomation.automationScheduled) {
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
    const validatedInput = this.constructCreateAutomationInput(input);
    const createdAutomation = await this.automationPrismaAdapter.createAutomation(validatedInput);

    if (createdAutomation.type === AutomationType.SCHEDULED && createdAutomation.automationScheduled) {
      await this.upsertEventBridge(
        input.workspaceId as string,
        createdAutomation.automationScheduled,
        createdAutomation,
        input.schedule?.dialogueId || undefined,
      );
    }

    return createdAutomation;
  }

  /**
   * Finds an automation (and its relationships) by the provided ID
   * @param automationId the ID of the automation
   * @returns an Automation with relationships included or null if no automation with specified ID exist in the database
   */
  public findAutomationById = (automationId: string) => {
    return this.automationPrismaAdapter.findAutomationById(automationId);
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
