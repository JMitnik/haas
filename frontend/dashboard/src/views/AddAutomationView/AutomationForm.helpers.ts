import {
  AutomationActionType,
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  ConditionPropertyAggregateType,
  CreateAutomationOperandInput,
  Customer,
  Maybe,
  OperandType,
  QuestionAspectType,
  QuestionNodeTypeEnum,
  RecurringPeriodType,
  RoleType,
  UserType,
} from 'types/generated-types';
import { TargetTypeEnum } from 'components/NodePicker/UserNodePicker';

import { CustomRecurringType, FormDataProps } from './AutomationForm.types';
import { TargetEntry } from './CreateActionModalCard';

export const getDayOfWeek = (type: RecurringPeriodType, data: FormDataProps) => {
  if (type !== RecurringPeriodType.Custom) {
    return data.schedule?.dayOfWeek as string;
  }

  return data?.schedule?.frequency === CustomRecurringType.DAILY
    ? data?.schedule?.dayRange?.map((day) => day?.label).join('-')
    : data.schedule?.frequency.split(' ')[2];
};

export const getDayOfMonth = (type: CustomRecurringType) => {
  switch (type) {
    case CustomRecurringType.DAILY:
      return '*';
    default:
      return type.split(' ')[0];
  }
};

export const getMonth = (type: CustomRecurringType) => {
  switch (type) {
    case CustomRecurringType.YEARLY:
      return type.split(' ')[1];
    default:
      return '*';
  }
};

export const getCronByScheduleType = (scheduleType: RecurringPeriodType) => {
  switch (scheduleType) {
    case RecurringPeriodType.EndOfDay:
      return {
        time: '0 18',
        type: scheduleType,
        dayRange: [{ label: 'MON', index: 1 }, { label: 'FRI', index: 4 }],
        frequency: CustomRecurringType.DAILY,
        minutes: '0',
        hours: '18',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON-FRI',
      };
    case RecurringPeriodType.EndOfWeek:
      return {
        time: '0 18',
        type: scheduleType,
        dayRange: [{ label: 'FRI', index: 4 }],
        frequency: CustomRecurringType.DAILY,
        minutes: '0',
        hours: '18',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'FRI',
      };
    case RecurringPeriodType.StartOfDay:
      return {
        time: '0 9',
        type: scheduleType,
        dayRange: [{ label: 'MON', index: 1 }, { label: 'FRI', index: 4 }],
        frequency: CustomRecurringType.DAILY,
        minutes: '0',
        hours: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON-FRI',
      };
    case RecurringPeriodType.StartOfWeek:
      return {
        time: '0 9',
        type: scheduleType,
        dayRange: [],
        frequency: CustomRecurringType.WEEKLY,
        minutes: '0',
        hours: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON',
      };
    case RecurringPeriodType.EveryWeek:
      return {
        time: '0 0',
        type: scheduleType,
        dayRange: [{ label: 'MON', index: 1 }],
        frequency: CustomRecurringType.WEEKLY,
        minutes: '0',
        hours: '0',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON',
      };
    case RecurringPeriodType.EveryMonth:
      return {
        time: '0 0',
        type: scheduleType,
        dayRange: [],
        frequency: CustomRecurringType.MONTHLY,
        minutes: '0',
        hours: '0',
        dayOfMonth: '1',
        month: '*',
        dayOfWeek: '*',
      };
    case RecurringPeriodType.EveryYear:
      return {
        time: '0 0',
        type: scheduleType,
        dayRange: [],
        frequency: CustomRecurringType.YEARLY,
        minutes: '0',
        hours: '0',
        dayOfMonth: '1',
        month: 'JAN',
        dayOfWeek: '*',
      };
    default:
      return {
        time: '0 0',
        type: RecurringPeriodType.Custom,
        dayRange: [{ label: 'MON', index: 1 }],
        frequency: CustomRecurringType.WEEKLY,
        minutes: '0',
        hours: '0',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON',
      };
  }
};

export const getCronByActionType = (actionType: AutomationActionType) => {
  switch (actionType) {
    case AutomationActionType.CustomReport:
      return getCronByScheduleType(RecurringPeriodType.Custom);
    case AutomationActionType.YearReport:
      return getCronByScheduleType(RecurringPeriodType.EveryYear);
    case AutomationActionType.MonthReport:
      return getCronByScheduleType(RecurringPeriodType.EveryMonth);
    default:
      return getCronByScheduleType(RecurringPeriodType.EveryWeek);
  }
};

export const getTypeByActionType = (actionType: AutomationActionType) => {
  switch (actionType) {
    case AutomationActionType.YearReport:
      return RecurringPeriodType.EveryYear;
    case AutomationActionType.MonthReport:
      return RecurringPeriodType.EveryMonth;
    case AutomationActionType.WeekReport:
      return RecurringPeriodType.EveryWeek;
    default:
      return RecurringPeriodType.Custom;
  }
};

export const mapToUserPickerEntries = (customer: Maybe<{
  __typename?: 'Customer' | undefined;
} & Pick<Customer, 'id'> & {
  users?: Maybe<({
    __typename?: 'UserType' | undefined;
  } & Pick<UserType, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'> & {
    role?: Maybe<{
      __typename?: 'RoleType' | undefined;
    } & Pick<RoleType, 'id' | 'name'>> | undefined;
  })[]> | undefined;
  roles?: Maybe<({
    __typename?: 'RoleType' | undefined;
  } & Pick<RoleType, 'id' | 'name'>)[]> | undefined;
}> | undefined) => {
  const userPickerEntries: TargetEntry[] = [];

  customer?.roles?.forEach((role) => {
    userPickerEntries.push({
      label: role.name!,
      value: role.id!,
      type: TargetTypeEnum.Role,
    });
  });

  customer?.users?.forEach((user) => {
    userPickerEntries.push({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
      type: TargetTypeEnum.User,
    });
  });

  return userPickerEntries;
};

export const mapConditions = (formData: FormDataProps, workspaceId?: string) => {
  const { conditions } = formData.conditionBuilder as any;
  return conditions.map(
    (condition: any) => {
      const operands: CreateAutomationOperandInput[] = [
        {
          operandType: OperandType.Int,
          numberValue: condition.compareTo,
        },
      ];

      if (condition.condition.activeQuestion.type === QuestionNodeTypeEnum.Choice
        || condition.condition.activeQuestion.type === QuestionNodeTypeEnum.VideoEmbedded) {
        operands.push({
          operandType: OperandType.String,
          textValue: condition?.condition?.questionOption,
        });
      }

      return ({
        scope: {
          type: condition?.condition?.scopeType as AutomationConditionScopeType,
          questionScope: {
            aspect: condition?.condition?.aspect as QuestionAspectType,
            aggregate: {
              type: condition?.condition?.aggregate as ConditionPropertyAggregateType,
              latest: condition?.condition?.latest,
            },
          },
        },
        operator: condition?.operator?.value as AutomationConditionOperatorType,
        questionId: condition?.condition?.activeQuestion?.value,
        dialogueId: condition.condition?.activeDialogue?.id,
        workspaceId,
        operands,
      });
    },
  );
};
