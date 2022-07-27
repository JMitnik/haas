import {
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  NodeType,
  PrismaClient,
  QuestionAspect,
  OperandType,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import * as AWS from 'aws-sdk';

import DialogueService from '../questionnaire/DialogueService';
import UserService from '../users/UserService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import AutomationConditionBuilderService from './AutomationConditionBuilderService';
import {
  AutomationCondition,
  AutomationTrigger,
  BuilderEntry,
  CheckedConditions,
  PreValidatedConditions,
  SetupQuestionCompareDataInput,
  SetupQuestionCompareDataOutput,
} from './AutomationTypes'
import { AutomationActionService } from './AutomationActionService';
import CustomerService from '../../models/customer/CustomerService';

class TriggerAutomationService {
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
   * Finds automation condition by its ID
   * @param automationConditionId the ID of an automation condition
   * @returns an automation condition
   */
  findAutomationConditionById = (automationConditionId: string) => {
    return this.automationPrismaAdapter.findAutomationConditionById(automationConditionId);
  };

  /**
   * Finds automation condition builder by its ID
   * @param builderId the ID of a condition builder
   * @returns a condition builder
   */
  findAutomationConditionBuilder = (builderId: string) => {
    return this.automationPrismaAdapter.findAutomationConditionBuilderById(builderId);
  };

  /**
   * Validates all conditions in a condition builder (including its nested condition builders)
   * @param builderId ID of the root condition builder
   * @returns a boolean indicating whether conditions have passed or not
   */
  validateConditionBuilder = async (builderId: string): Promise<boolean> => {
    const conditionBuilder = await this.automationPrismaAdapter.findAutomationConditionBuilderById(builderId);
    const destructedData = await this.destructureBuilder(conditionBuilder as BuilderEntry);
    const validatedObjects = await this.validateConditions(destructedData, {});

    const builderConditionsPassed = AutomationConditionBuilderService.checkConditions(validatedObjects);
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

    const amountOperand = operands.find((operand) => operand.type === OperandType.INT);
    const textOperand = operands.find((operand) => operand.type === OperandType.STRING)?.textValue;

    if (textOperand) {
      compareValue = Object.keys(scopedChoiceNodeEntries.aggregatedValues).find(
        (key) => key === textOperand
      ) ? scopedChoiceNodeEntries.aggregatedValues[textOperand] : 0;
    }

    // if matchValue doesn't exist that's a condition problem -> returning null.
    // if key doesn't exist in scopedChoiceNodeEntries.aggregatedValues -> returning 0.
    return {
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
      return false;
    }

    // Want latest X but there is less than X *new* entries in the database => return false
    // TODO: Add this batch option to event instead of condition
    const hasNotEnoughLatest = (
      condition.questionScope?.aggregate?.latest &&
      scopedData.totalEntries % condition.questionScope?.aggregate?.latest !== 0
    );

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
    if (!candidateAutomations) return;

    const triggeredAutomations = await Promise.all(candidateAutomations.map(async (automationTrigger) => {
      const { trigger, workspaceSlug, dialogueSlug } = automationTrigger;

      if (!trigger) return null;

      const allConditionsConfirmed = await this.validateConditionBuilder(trigger.automationConditionBuilderId);

      if (allConditionsConfirmed) {
        await Promise.all(trigger?.actions?.map((automationAction) => {
          return this.automationActionService.handleAutomationAction(automationAction, workspaceSlug, dialogueSlug)
        }));
      } else {
        console.log('One or more conditions have failed. No action done');
      }
    }));

    return triggeredAutomations;
  }

}

export default TriggerAutomationService;
