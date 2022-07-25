import * as yup from 'yup';

import {
  AutomationActionType,
  AutomationConditionScopeType,
  AutomationType,
  ConditionPropertyAggregateType,
  RecurringPeriodType,
} from 'types/generated-types';

export enum CustomRecurringType {
  YEARLY = '1 JAN *',
  MONTHLY = '1 * *',
  WEEKLY = '* * MON',
  DAILY = '* *',
}

export const schema = yup.object({
  title: yup.string().required('Title is required'),
  automationType: yup.mixed<AutomationType>().oneOf(Object.values(AutomationType)),
  conditionBuilder: yup.object().shape({
    logical: yup.object().shape({
      label: yup.string().notRequired(),
      value: yup.string().notRequired(),
    }),
    conditions: yup.array().of(
      yup.object().required().shape(
        {
          operator: yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }).nullable(),
          compareTo: yup.number().notRequired(),
          depth: yup.number().notRequired(),
          condition: yup.object().shape({
            scopeType: yup.mixed<AutomationConditionScopeType>().oneOf(Object.values(AutomationConditionScopeType)),
            activeDialogue: yup.object().shape({
              id: yup.string().required(),
              label: yup.string().required(),
              value: yup.string().required(),
              type: yup.string().required(),
            }).nullable(true),
            activeQuestion: yup.object().shape({
              label: yup.string().required(),
              value: yup.string().required(),
              type: yup.string().required(),
            }).required(),
            aspect: yup.string().required(),
            aggregate: yup.mixed<ConditionPropertyAggregateType>().oneOf(Object.values(ConditionPropertyAggregateType)),
            latest: yup.number().required(),
            questionOption: yup.string().notRequired().nullable(false),
          }).required(),
        },
      ),
    ).notRequired(),
    childBuilder: yup.object().shape({
      logical: yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
      conditions: yup.array().of(
        yup.object().required().shape(
          {
            operator: yup.object().shape({
              label: yup.string().required(),
              value: yup.string().required(),
            }).nullable(),
            compareTo: yup.number().notRequired(),
            depth: yup.number().required(),
            condition: yup.object().shape({
              scopeType: yup.string().required(),
            }).required(),
          },
        ),
      ).notRequired(),
    }).nullable().notRequired(),
  }).notRequired().when('automationType', {
    is: (autoType) => autoType === AutomationType.Trigger,
    then: yup.object().shape({
      logical: yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
      conditions: yup.array().of(
        yup.object().required().shape(
          {
            operator: yup.object().shape({
              label: yup.string().required(),
              value: yup.string().required(),
            }).nullable(),
            compareTo: yup.number().notRequired(),
            depth: yup.number().notRequired(),
            condition: yup.object().shape({
              scopeType: yup.mixed<AutomationConditionScopeType>().oneOf(Object.values(AutomationConditionScopeType)),
              activeDialogue: yup.object().shape({
                id: yup.string().required(),
                label: yup.string().required(),
                value: yup.string().required(),
                type: yup.string().required(),
              }).nullable(true),
              activeQuestion: yup.object().shape({
                label: yup.string().required(),
                value: yup.string().required(),
                type: yup.string().required(),
              }).required(),
              aspect: yup.string().required(),
              aggregate: yup.mixed<ConditionPropertyAggregateType>().oneOf(Object.values(ConditionPropertyAggregateType)),
              latest: yup.number().required(),
              questionOption: yup.string().notRequired().nullable(false),
            }).required(),
          },
        ),
      ).required(),
      childBuilder: yup.object().shape({
        logical: yup.object().shape({
          label: yup.string().required(),
          value: yup.string().required(),
        }),
        conditions: yup.array().of(
          yup.object().required().shape(
            {
              operator: yup.object().shape({
                label: yup.string().required(),
                value: yup.string().required(),
              }).nullable(),
              compareTo: yup.number().notRequired(),
              depth: yup.number().required(),
              condition: yup.object().shape({
                scopeType: yup.string().required(),
              }).required(),
            },
          ),
        ).notRequired(),
      }).nullable().notRequired(),
    }).required(),
  }),
  schedule: yup.object().shape({
    activeDialogue: yup.object().shape({
      type: yup.string(),
      label: yup.string(),
      id: yup.string(),
    }).nullable(true),
    type: yup.mixed<RecurringPeriodType>().oneOf(Object.values(RecurringPeriodType)),
    minutes: yup.string(),
    hours: yup.string(),
    dayOfMonth: yup.string(),
    month: yup.string(),
    dayOfWeek: yup.string(),
    frequency: yup.string(),
    time: yup.string(),
    dayRange: yup.array().of(
      yup.object().shape({
        label: yup.string(),
        index: yup.number(),
      }),
    ),
  }).when('automationType', {
    is: (autoType) => autoType === AutomationType.Scheduled,
    then: yup.object().shape({
      type: yup.mixed<RecurringPeriodType>().oneOf(Object.values(RecurringPeriodType)).required(),
      frequency: yup.string().required(),
      time: yup.string().required(),
      dayRange: yup.array().when('frequency', {
        is: (frequencyType) => frequencyType === CustomRecurringType.DAILY,
        then: yup.array().required().of(
          yup.object().required().shape({
            label: yup.string().required(),
            index: yup.number().required(),
          }),
        ),
      }).of(
        yup.object().shape({
          label: yup.string(),
          index: yup.number(),
        }),
      ),
      activeDialogue: yup.object().shape({
        type: yup.string().required(),
        label: yup.string().required(),
        id: yup.string().required(),
      }).required(),
    }).required(),
  }),
  actions: yup.array().of(
    yup.object().shape({
      action: yup.object().shape({
        channelId: yup.string(),
        id: yup.string(),
        type: yup.mixed<AutomationActionType>().oneOf(Object.values(AutomationActionType)),
        targets: yup.array().of(
          yup.object().shape({
            label: yup.string(),
            type: yup.string(),
            value: yup.string(),
          }),
        ),
      }).nullable(),
    }),
  ).required(),
}).required();

export type FormDataProps = yup.InferType<typeof schema>;
