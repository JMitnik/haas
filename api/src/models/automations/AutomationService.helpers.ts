import { GraphQLYogaError } from '@graphql-yoga/node';
import { AutomationActionType, AutomationConditionBuilderType, AutomationConditionOperatorType, AutomationConditionScopeType, AutomationScheduled } from 'prisma/prisma-client';
import { UserInputError } from 'apollo-server-express';
import { format } from 'date-fns';
import { NexusGenInputs } from 'generated/nexus';
import { isPresent } from 'ts-is-present';
import {
  CustomRecurringType,
  DateFormat,
  DAYS,
  GenerateReportLambdaParams,
  SendDialogueLinkLambdaParams,
} from './AutomationService.types';
import { CreateAutomationConditionInput, CreateAutomationConditionScopeInput, CreateAutomationInput, CreateConditionOperandInput, UpdateAutomationInput } from './AutomationTypes';

// TODO: Find a better place for this (Should we create a common helpers folder which can be accessed by both front-end and api)
export const toDayFormat = (date: Date) => format(date, DateFormat.DayFormat);

export const findReportQueryParamsByCron = (frequency: CustomRecurringType) => {
  switch (frequency) {
    case CustomRecurringType.DAILY:
      return {
        type: 'daily',
      }
    case CustomRecurringType.MONTHLY:
      return {
        type: 'monthly',
      }
    case CustomRecurringType.YEARLY:
      return {
        type: 'yearly',
      }
    case CustomRecurringType.WEEKLY:
    default:
      return {
        type: 'weekly',
      }
  }
}

/**
 * Finds the correct parameters for a specific lambda based on the AutomationActionType
 * @param type
 * @param generateLambdaParams
 * @param sendDialogueLinkParams
 * @returns a params object
 */
export const findLambdaParamsByActionType = (
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
 * Finds the correct deployed lambdaArn based on automation action
 */
export const findLambdaArnByAction = (type: AutomationActionType) => {
  switch (type) {
    case AutomationActionType.SEND_DIALOGUE_LINK:
      return process.env.SEND_DIALOGUE_LINK_LAMBDA_ARN as string;
    case AutomationActionType.WEEK_REPORT:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
    case AutomationActionType.MONTH_REPORT:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
    case AutomationActionType.YEAR_REPORT:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
    default:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
  }
}

/**
 * Converts a dayOfWeek cron entry into an array of day entries
 * @param dayOfWeek - cron entry for dayOfWeek (e.g. *, MON, TUE-FRI etc.)
 * @returns an array with day entries (index: number, label: string)
 */
export const getDayRange = (dayOfWeek: string) => {
  const isWildcard = dayOfWeek.length === 1;
  if (isWildcard) return [];

  const splittedDays = dayOfWeek.split('-')
  const mappedToDayRange = splittedDays.map(
    (dayLabel) => DAYS.find((day) => day.label === dayLabel)
  ).filter(isPresent);
  return mappedToDayRange;
}

/**
 * Constructs a frequency cron string based on the matching period type
 * @param scheduledAutomation
 * @returns
 */
export const buildFrequencyCronString = (scheduledAutomation: AutomationScheduled) => {
  const frequency = `${scheduledAutomation.dayOfMonth} ${scheduledAutomation.month} ${scheduledAutomation.dayOfWeek}`;
  if (frequency === CustomRecurringType.YEARLY
    || frequency === CustomRecurringType.MONTHLY
    || frequency === CustomRecurringType.WEEKLY
  ) {
    return `${scheduledAutomation.dayOfMonth} ${scheduledAutomation.month} ${scheduledAutomation.dayOfWeek}` as CustomRecurringType;
  }
  // If not yearly, monthly or weekly => must be daily. dayOfWeek cron entry is handled by different field so don't add here
  return CustomRecurringType.DAILY;
}

/**
   * Validates the condition scope input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param condition input object for an AutomationConditionScope
   * @returns a validated AutomationConditionScope input object where it is sure specific fields exist
   * @throws UserInputError if not all information is required
   */
export const validateCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): Required<NexusGenInputs['CreateAutomationCondition']> => {
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
export const constructCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): CreateAutomationConditionScopeInput => {
  const validatedCondition = validateCreateAutomationConditionScopeInput(condition);

  return {
    ...validatedCondition.scope,
    type: validatedCondition.scope?.type,
  } as CreateAutomationConditionScopeInput;
}

export const hasEmptyTargetList = (payload: any): boolean => {
  if (!payload) return true;
  const targetsProperty = Object.entries(payload).find((entry) => entry[0] === 'targets') as [string, Array<string>] | undefined;
  return targetsProperty ? targetsProperty[1].length === 0 : true;
}

/**
   * Validates data input for automation actions
   * @param input
   * @returns validated CREATE prisma automation actions data list
   */
export const validateAutomationActionsInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['actions'] => {
  if (input?.actions?.length === 0) throw new UserInputError('No actions provided for automation!');

  input.actions?.forEach((action) => {
    const hasNoTarget = action?.payload ? (Object.entries(action.payload).length === 0
      || !Object.keys(action.payload).find((key) => key === 'targets')
      || hasEmptyTargetList(action.payload)) : true;

    switch (action?.type) {
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
export const constructAutomationActionsInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['actions'] => {
  const validatedActions = validateAutomationActionsInput(input);
  return validatedActions;
}


/**
   * Validates the AutomationCondition input list provided by checking the existence of fields could be potentially undefined or null
   * @param input object containing a list with AutomationCondition input entries
   * @returns a validated AutomationCondition input list
   * @throws UserInputError if not all information is required
   */
// TODO: Re-implement later DONT REMOVE
// validateCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationInput']): Required<NexusGenInputs['CreateAutomationCondition'][]> => {
//   if (input.conditionBuilder?.conditions?.length === 0) throw new UserInputError('No conditions provided for automation');

//   input.conditionBuilder?.conditions?.forEach((condition) => {
//     if (!condition?.operator) {
//       throw new UserInputError('No operator type is provided for a condition');
//     }
//     if (condition.operands?.length === 0) throw new UserInputError('No match values provided for an automation condition!');
//     condition.operands?.forEach((operand) => {
//       if (!operand?.operandType) {
//         throw new UserInputError('No match value type was provided for a condition!');
//       }
//     });
//   });

//   return input.conditionBuilder?.conditions as Required<NexusGenInputs['CreateAutomationCondition'][]>;
// }

export const constructBuilderRecursive = (input: NexusGenInputs['AutomationConditionBuilderInput']): CreateAutomationInput['conditionBuilder'] => {
  let mappedConditions: CreateAutomationConditionInput[] = [];
  let childConditionBuilder;

  if (input.conditions?.length) {
    mappedConditions = input.conditions.map((condition) => {
      return {
        ...condition,
        operator: condition?.operator as Required<AutomationConditionOperatorType>,
        scope: constructCreateAutomationConditionScopeInput(condition!),
        operands: condition?.operands?.map((operand) => {
          const { dateTimeValue, operandType, numberValue, textValue, id } = operand!;

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
    childConditionBuilder = constructBuilderRecursive(input.childConditionBuilder);
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
// TODO: Reimplement later DONT REMOVE
// constructCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['conditions'] => {
//   const validatedConditions = this.validateCreateAutomationConditionsInput(input) as Required<NexusGenInputs['CreateAutomationCondition'][]>;

//   const mappedConditions: CreateAutomationInput['conditions'] = validatedConditions?.map((condition) => {
//     return {
//       ...condition,
//       operator: condition.operator as Required<AutomationConditionOperatorType>,
//       scope: this.constructCreateAutomationConditionScopeInput(condition),
//       operands: condition.operands?.map((operand) => {
//         const { dateTimeValue, operandType, numberValue, textValue } = operand!;

//         return {
//           dateTimeValue,
//           numberValue,
//           textValue,
//           type: operandType,
//         }
//       }) as Required<CreateConditionOperandInput[]> || [],
//     }
//   }) || [];

//   return mappedConditions;
// }

/**
   * Validates the AutomationEvent input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a AutomationEvent input entry
   * @returns a validated AutomationEvent input object where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
export const constructCreateAutomationEventInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['event'] => {
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
export const validateCreateAutomationInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput => {
  if (!input) throw new GraphQLYogaError('No input provided create automation with!');
  if (!input.label || typeof input.label === undefined || input.label === null) throw new GraphQLYogaError('No label provided for automation!');

  if (!input.automationType) throw new GraphQLYogaError('No automation type provided for automation!');
  if (!input.workspaceId) throw new GraphQLYogaError('No workspace Id provided for automation!');
  return input as Required<CreateAutomationInput>;
}

export const buildSchedule = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput['schedule'] | undefined => {
  return input?.schedule
    ? {
      dayOfMonth: input.schedule.dayOfMonth,
      dayOfWeek: input.schedule.dayOfWeek,
      hours: input.schedule.hours,
      minutes: input.schedule.minutes,
      month: input.schedule.month,
      type: input.schedule.type,
      id: input.schedule?.id || undefined,
      dialogueScope: input.schedule?.dialogueId ? {
        connect: {
          id: input.schedule.dialogueId,
        },
      } : undefined,
    }
    : undefined;
}

/**
   * Constructs the Automation prisma data object for CREATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to create an automation
   * @returns a validated Automation prisma data object
   * @throws UserInputError if not all information is required
   */
export const constructCreateAutomationInput = (input: NexusGenInputs['CreateAutomationInput']): CreateAutomationInput => {
  const validatedInput = validateCreateAutomationInput(input);

  // const conditionBuilder = validatedInput.automationType === AutomationType.TRIGGER
  //   ? this.constructBuilderRecursive(input.conditionBuilder as Required<NexusGenInputs['AutomationConditionBuilderInput']>)
  //   : undefined;

  return {
    label: validatedInput.label,
    workspaceId: validatedInput.workspaceId,
    automationType: validatedInput.automationType,
    event: constructCreateAutomationEventInput(input),
    actions: constructAutomationActionsInput(input),
    description: input.description,
    conditionBuilder: undefined, // TODO: Re-implemented later
    schedule: buildSchedule(input),
  }
}

/**
   * Validates the Automation input object for UPDATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to update an automation
   * @returns a validated Automation input object containing all information necessary to update an Automation
   * @throws UserInputError if not all information is required
   */
export const constructUpdateAutomationInput = (input: NexusGenInputs['CreateAutomationInput']): UpdateAutomationInput => {
  if (!input.id) throw new UserInputError('No ID provided for automation that should be updated!');
  // if (input.automationType === AutomationType.TRIGGER && !input.conditionBuilder?.id) throw new UserInputError('No ID provided for the root condition builder');

  return { ...constructCreateAutomationInput(input), id: input.id }
}

/**
 * Converts an AutomationScheduled properties to a relevant cron expression.
 */
export const parseScheduleToCron = (schedule: AutomationScheduled): string => {
  const { minutes, hours, dayOfMonth, dayOfWeek, month } = schedule;

  // Transform the CRON expression to one supported by AWS (? indicator is not part of cron-validator)
  const scheduledExpression = `cron(${minutes} ${hours} ${dayOfMonth === '*' ? '?' : dayOfMonth} ${month} ${dayOfMonth === '1' ? '?' : dayOfWeek} *)`

  return scheduledExpression;
}
