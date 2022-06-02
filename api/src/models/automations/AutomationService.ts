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
  Prisma,
  AutomationType,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { UserInputError } from 'apollo-server-express';
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
import { GenerateReportPayload, TargetsPayload, TargetType } from 'models/users/UserServiceTypes';

class AutomationService {
  automationPrismaAdapter: AutomationPrismaAdapter;
  dialogueService: DialogueService;
  userService: UserService;
  automationActionService: AutomationActionService;
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.dialogueService = new DialogueService(prisma);
    this.automationActionService = new AutomationActionService(prisma);
    this.userService = new UserService(prisma);
    this.prisma = prisma;
  }

  createScheduled = async (workspaceSlug: string) => {
    // TODO: Remove accessKeys and replace it with something that lets deployed account run this
    const clientEvent = new AWS.EventBridge({
      region: 'eu-central-1',
      accessKeyId: config.autodeckAwsAccessKeyId,
      secretAccessKey: config.autodeckAwsSecretAccessKey,
    });

    const rules = await clientEvent.listRules({
      NamePrefix: 'NEW_EVENT_BRIDGE_TEST',
      Limit: 1,
    }).promise();

    console.log('Rules: ', rules.Rules);

    await clientEvent.deleteRule({
      Name: 'NEW_EVENT_BRIDGE_TEST',
    }).promise();

    const rule = await clientEvent.putRule({
      Name: 'NEW_EVENT_BRIDGE_TEST',
      ScheduleExpression: 'cron(* * ? * MON-FRI *)',
      State: 'DISABLED',
    }).promise();

    const ruleArn = rule.RuleArn;
    console.log('workspaceSlug: ', workspaceSlug);

    await this.prisma.automation.create({
      data: {
        type: AutomationType.SCHEDULED,
        label: 'Scheduled automation',
        description: 'My first scheduled automation',
        workspace: {
          connect: {
            slug: workspaceSlug,
          },
        },
        automationScheduled: {
          create: {
            actions: {
              create: {
                type: 'SEND_EMAIL',
                payload: {
                  targets: [
                    {
                      type: 'USER',
                      value: 'daan@haas.live',
                      label: 'Daan Helsloot',
                    },
                  ],
                },
              },
            },
            minutes: '*',
            hours: '*',
            dayOfMonth: '?',
            month: '*',
            dayOfWeek: 'MON-FRI',
            year: '*',
          },
        },
      },
    })

    return ruleArn;
  }

  deleteAutomation = async (input: NexusGenInputs['DeleteAutomationInput']) => {
    return this.automationPrismaAdapter.deleteAutomation(input);
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
    const conditions: CreateAutomationInput['conditions'] = this.constructCreateAutomationConditionsInput(input);

    const builderInput = input.conditionBuilder as Required<NexusGenInputs['AutomationConditionBuilderInput']>;
    const conditionBuilder: CreateAutomationInput['conditionBuilder'] = this.constructBuilderRecursive(builderInput)
    const event: CreateAutomationInput['event'] = this.constructCreateAutomationEventInput(input);
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
    return { ...createInput, id: id, conditions: createInput.conditions || [] }
  }

  /**
   * Enables/Disables an automation 
   * @param input an object containing the automation id as well as the state (true/false) of the automation
   */
  public enableAutomation = (input: NexusGenInputs['EnableAutomationInput']) => {
    return this.automationPrismaAdapter.enableAutomation(input);
  };

  /**
   * Updates an automation with the provided data after validating all
   * @param input object containing all information needed to update an automation
   * @returns updated Automation (without relationship fields)
   * @throws UserInputError if not all information is required
   */
  public updateAutomation = (input: NexusGenInputs['CreateAutomationInput']) => {
    // Test whether input data matches what's needed to update an automation
    const validatedInput = this.constructUpdateAutomationInput(input);
    return this.automationPrismaAdapter.updateAutomation(validatedInput);
  }

  /**
   * Creates an automation with the provided data after validating all
   * @param input object containing all information needed to create an automation
   * @returns created Automation (without relationship fields)
   * @throws UserInputError if not all information is required
   */
  public createAutomation = (input: NexusGenInputs['CreateAutomationInput']) => {
    // Test whether input data matches what's needed to create an automation
    const validatedInput = this.constructCreateAutomationInput(input);
    return this.automationPrismaAdapter.createAutomation(validatedInput);
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
