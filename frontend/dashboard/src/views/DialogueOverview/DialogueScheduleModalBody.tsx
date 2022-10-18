/* eslint-disable react/no-unused-prop-types */
import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import * as Switch from 'components/Common/Switch';
import {
  CreateDialogueScheduleInput,
  DialogueSchedule,
  useCreateDialogueScheduleMutation,
} from 'types/generated-types';
import { CustomRecurringType } from 'views/AddAutomationView/AutomationForm.types';
import { Day, DayPicker } from 'components/Common/DatePicker/DayPicker';
import { RecurringDatePicker } from 'components/Common/DatePicker/RecurringDatePicker';
import { TimePicker } from 'components/Common/DatePicker/TimePicker';
import { ReactComponent as TopicsThumbnail } from 'assets/images/thumbnails/sm/sendout.svg';
import {
  recurringDateToCron,
  recurringDateToEndDeltaMinutes,
} from 'components/Common/DatePicker/RecurringDatePicker.helper';
import { useCustomer } from 'providers/CustomerProvider';

import {
  addMinutesToPeriod,
  deltaPeriodsInMinutes,
  parseCronToPeriod,
  parseCronToRecurring,
  parsePeriodToCron,
} from './DialogueScheduleModalBody.helper';

export enum DialogueScheduleStep {
  INTRO = 'intro',
  DATA_PERIOD = 'dataPeriod',
  EVAL_PERIOD = 'evalPeriod',
}

interface DialogueScheduleState {
  [DialogueScheduleStep.DATA_PERIOD]: {
    schedule: CustomRecurringType;
  },
  [DialogueScheduleStep.EVAL_PERIOD]?: {
    startDay?: Day;
    startTime?: string;
    endDay?: Day;
    endTime?: string;
  },
}

const steps = [
  DialogueScheduleStep.INTRO, DialogueScheduleStep.DATA_PERIOD, DialogueScheduleStep.EVAL_PERIOD,
];

const defaultState: DialogueScheduleState = {
  dataPeriod: {
    schedule: CustomRecurringType.WEEKLY,
  },
  evalPeriod: undefined,
};

interface StepProps {
  state: DialogueScheduleState;
  onSave?: (state: DialogueScheduleState) => void;
  onNextStep?: (state: DialogueScheduleState) => void;
  onPrevStep?: (state: DialogueScheduleState) => void;
}

const IntroStep = ({ state, onNextStep }: StepProps) => (
  <UI.ColumnFlex height="100%">
    <UI.ModalBody maxWidth={600} flex="100%" alignItems="center" display="flex">
      <UI.Div>
        <UI.H4 textAlign="center" color="off.600">
          How it works
        </UI.H4>
        <UI.Text fontSize="1rem" color="off.600" textAlign="center">
          This automation allows you to define
          {' '}
          <strong>opening</strong>
          {' '}
          and
          {' '}
          <strong>closing</strong>
          {' '}
          times
          for your dialogues and data.
          <br />
          Any people
          accessing your dialogue afterwards will be prompted
          with a notification to come back later.
        </UI.Text>
      </UI.Div>
    </UI.ModalBody>
    <UI.ModalFooter>
      <UI.Div>
        <UI.Div>
          <UI.Button onClick={() => onNextStep?.(state)} width="100%" size="md">
            Get started
          </UI.Button>
        </UI.Div>
      </UI.Div>
    </UI.ModalFooter>
  </UI.ColumnFlex>
);

const dataPeriodSchema = yup.object({
  schedule: yup.string().ensure(),
});

const DataPeriodStep = ({ state, onNextStep, onPrevStep }: StepProps) => {
  const form = useForm({
    resolver: yupResolver(dataPeriodSchema),
    defaultValues: {
      schedule: state.dataPeriod?.schedule || CustomRecurringType.WEEKLY,
    },
  });

  const { isValid } = form.formState;
  const { handleSubmit } = form;

  const buildNewState = () => {
    const values = form.getValues();

    return {
      ...state,
      dataPeriod: {
        schedule: values.schedule || CustomRecurringType.WEEKLY,
      },
    };
  };

  const handleForward = () => {
    onNextStep?.(buildNewState());
  };

  const goBack = () => {
    onPrevStep?.(buildNewState());
  };

  return (
    <UI.Form onSubmit={handleSubmit(handleForward, (e) => console.log(e))} style={{ height: '100%' }}>
      <UI.ColumnFlex height="100%">
        <UI.ModalBody maxWidth={600} flex="100%">
          <UI.H4 color="off.500">
            Data period
          </UI.H4>
          <UI.Div position="relative">
            <UI.FormControl>
              <UI.FormLabel fontWeight={400} color="off.500">
                How often do you wish to refresh your data?
              </UI.FormLabel>
              <Controller
                name="schedule"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <RecurringDatePicker value={value} onChange={onChange} />
                )}
              />
            </UI.FormControl>
          </UI.Div>

        </UI.ModalBody>
        <UI.ModalFooter>
          <UI.Grid gridTemplateColumns="1fr 1fr">
            <UI.Div>
              {!!onPrevStep && (
                <UI.Button onClick={goBack} width="100%" size="md" variant="outline" variantColor="off">
                  Previous
                </UI.Button>
              )}
            </UI.Div>
            <UI.Div>
              <UI.Button
                isDisabled={!isValid}
                type="submit"
                width="100%"
                size="md"
              >
                Next
              </UI.Button>
            </UI.Div>
          </UI.Grid>
        </UI.ModalFooter>
      </UI.ColumnFlex>
    </UI.Form>
  );
};

const ToggleLabel = styled.span`
  ${({ theme }) => css`
    display: inline-block;
    background: ${theme.colors.main[100]};
    color: ${theme.colors.main[700]};
    padding: 4px 8px;
    font-weight: 600;
    border-radius: 10px;
  `}
`;

const evalPeriodSchema = yup.object({
  enabled: yup.boolean(),
  startDay: yup.string().when('enabled', {
    is: (enabled: boolean) => !!enabled,
    then: yup.string().required(),
    otherwise: yup.string().optional(),
  }),
  startTime: yup.string().when('enabled', {
    is: (enabled: boolean) => !!enabled,
    then: yup.string().required(),
    otherwise: yup.string().optional(),
  }),
  endDay: yup.string().when('enabled', {
    is: (enabled: boolean) => !!enabled,
    then: yup.string().required(),
    otherwise: yup.string().optional(),
  }),
  endTime: yup.string().when('enabled', {
    is: (enabled: boolean) => !!enabled,
    then: yup.string().required(),
    otherwise: yup.string().optional(),
  }),
});

const EvalPeriodStep = ({ state, onNextStep, onPrevStep }: StepProps) => {
  const { t } = useTranslation();
  const form = useForm({
    resolver: yupResolver(evalPeriodSchema),
    defaultValues: {
      isEnabled: !!state.evalPeriod,
      startDay: state.evalPeriod?.startDay || 'MON' as Day,
      endDay: state.evalPeriod?.endDay || 'Fri' as Day,
      startTime: state.evalPeriod?.startTime || '09:00AM',
      endTime: state.evalPeriod?.endTime || '09:00AM',
    },
  });

  const { isValid } = form.formState;
  const { handleSubmit } = form;

  const buildNewState = () => {
    const values = form.getValues();

    return {
      ...state,
      evalPeriod: {
        startDay: values.startDay,
        startTime: values.startTime,
        endDay: values.endDay,
        endTime: values.endTime,
      },
    };
  };

  const isEnabled = form.watch('isEnabled');

  const handleForward = () => {
    onNextStep?.(buildNewState());
  };

  const goBack = () => {
    onPrevStep?.(buildNewState());
  };

  return (
    <UI.Form onSubmit={handleSubmit(handleForward, (e) => console.log(e))} style={{ height: '100%' }}>
      <UI.ColumnFlex height="100%">
        <UI.ModalBody maxWidth={600} flex="100%">
          <UI.H4 color="off.500">
            Automatic open and close
          </UI.H4>

          <UI.FormControl>
            <UI.Flex justifyContent="space-between">
              <UI.FormLabel fontWeight={400} color="off.500">
                Enable automatic open and closing of dialogue
              </UI.FormLabel>
              <Controller
                name="isEnabled"
                control={form.control}
                render={({ field: { value, onChange } }) => (
                  <Switch.Root
                    isChecked={value}
                    onChange={() => onChange(!value)}
                  >
                    <Switch.Thumb />
                  </Switch.Root>
                )}
              />
            </UI.Flex>
          </UI.FormControl>

          {isEnabled && (
            <UI.Div mt={4} position="relative">
              <UI.FormControl>
                <UI.FormLabel fontWeight={400} color="off.500">
                  Schedule
                </UI.FormLabel>

                <UI.Div color="off.600">
                  <UI.Div mb={1}>
                    Open the dialogue every
                    {' '}
                    <ToggleLabel>week</ToggleLabel>
                  </UI.Div>
                  <UI.Div mb={1}>
                    on
                    {' '}
                    <Controller
                      name="startDay"
                      control={form.control}
                      render={({ field: { value, onChange } }) => (
                        <DayPicker value={value} onChange={onChange}>
                          <ToggleLabel>{t(`weekday_${value?.toLowerCase()}`)}</ToggleLabel>
                        </DayPicker>
                      )}
                    />
                    {' '}
                    at
                    {' '}
                    <Controller
                      name="startTime"
                      control={form.control}
                      render={({ field: { value, onChange } }) => (
                        <TimePicker value={value} onChange={onChange}>
                          <ToggleLabel>{value}</ToggleLabel>
                        </TimePicker>
                      )}
                    />
                  </UI.Div>
                  {' '}
                  until
                  {' '}
                  <Controller
                    name="endDay"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <DayPicker value={value} onChange={onChange}>
                        <ToggleLabel>{t(`weekday_${value?.toLowerCase()}`)}</ToggleLabel>
                      </DayPicker>
                    )}
                  />
                  {' '}
                  at
                  {' '}
                  <Controller
                    name="endTime"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <TimePicker value={value} onChange={onChange}>
                        <ToggleLabel>{value}</ToggleLabel>
                      </TimePicker>
                    )}
                  />
                </UI.Div>
              </UI.FormControl>
            </UI.Div>
          )}

        </UI.ModalBody>
        <UI.ModalFooter>
          <UI.Grid gridTemplateColumns="1fr 1fr">
            <UI.Div>
              <UI.Button onClick={goBack} width="100%" size="md" variant="outline" variantColor="off">
                Previous
              </UI.Button>
            </UI.Div>
            <UI.Div>
              <UI.Button
                isDisabled={!isValid}
                type="submit"
                width="100%"
                size="md"
              >
                Complete
              </UI.Button>
            </UI.Div>
          </UI.Grid>
        </UI.ModalFooter>
      </UI.ColumnFlex>
    </UI.Form>
  );
};

interface DialogueScheduleModalBodyProps {
  dialogueSchedule?: DialogueSchedule;
  onClose?: () => void;
}

export const DialogueScheduleModalBody = ({
  onClose,
  dialogueSchedule = undefined,
}: DialogueScheduleModalBodyProps) => {
  const inEdit = !!dialogueSchedule;
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [state, setState] = useState<DialogueScheduleState>(() => {
    if (!dialogueSchedule) return defaultState;

    const evalPeriodStartPeriod = dialogueSchedule.evaluationPeriodSchedule?.startDateExpression
      ? parseCronToPeriod(dialogueSchedule.evaluationPeriodSchedule.startDateExpression)
      : undefined;
    const evalPeriodEndPeriod = evalPeriodStartPeriod
      ? addMinutesToPeriod(evalPeriodStartPeriod, dialogueSchedule.evaluationPeriodSchedule?.endInDeltaMinutes || 0)
      : undefined;

    const schedule = dialogueSchedule.dataPeriodSchedule?.startDateExpression
      ? parseCronToRecurring(dialogueSchedule.dataPeriodSchedule?.startDateExpression)
      : CustomRecurringType.WEEKLY;

    return {
      dataPeriod: {
        schedule,
      },
      evalPeriod: {
        startDay: evalPeriodStartPeriod?.day,
        startTime: evalPeriodStartPeriod?.time,
        endDay: evalPeriodEndPeriod?.day,
        endTime: evalPeriodEndPeriod?.time,
      },
    };
  });
  const { activeCustomer } = useCustomer();

  const [create, { loading: isLoading, error }] = useCreateDialogueScheduleMutation({
    refetchQueries: ['automationConnection'],
    onCompleted: () => {
      onClose?.();
    },
  });

  const relevantSteps = useMemo(() => (inEdit ? steps.slice(1) : steps), [inEdit]);

  const activeStep = relevantSteps[activeStepIndex];

  const prevStep = (newState: DialogueScheduleState) => {
    setState(newState);
    setActiveStepIndex((idx) => idx - 1);
  };

  const nextStep = (newState: DialogueScheduleState) => {
    setState(newState);
    setActiveStepIndex((idx) => idx + 1);
  };

  const stateToCreate = (activeState: DialogueScheduleState): CreateDialogueScheduleInput => ({
    workspaceId: activeCustomer?.id || '-1',
    dataPeriod: {
      startDateExpression: recurringDateToCron(activeState.dataPeriod.schedule),
      endInDeltaMinutes: recurringDateToEndDeltaMinutes(activeState.dataPeriod.schedule),
    },
    evaluationPeriod: {
      startDateExpression: parsePeriodToCron({
        day: activeState.evalPeriod?.startDay,
        time: activeState.evalPeriod?.startTime,
      }),
      endInDeltaMinutes: activeState.evalPeriod ? deltaPeriodsInMinutes(
        { day: activeState.evalPeriod.startDay, time: activeState.evalPeriod?.startTime },
        { day: activeState.evalPeriod.endDay, time: activeState.evalPeriod?.endTime },
      ) : -1,
    },
  });

  const submit = (newState: DialogueScheduleState) => {
    setState(newState);

    create({
      variables: {
        input: stateToCreate(newState),
      },
    });
  };

  return (
    <UI.Div>
      <UI.ModalHead>
        <UI.Flex>
          <UI.Div maxWidth={70} mr={4}>
            <UI.Thumbnail size="sm">
              <TopicsThumbnail />
            </UI.Thumbnail>
          </UI.Div>

          <UI.Div>
            <UI.H3 color="off.500">
              Automated schedules
            </UI.H3>
            <UI.Text fontSize="1.1rem" color="off.400">
              Setup your automated schedules
            </UI.Text>
          </UI.Div>
        </UI.Flex>
      </UI.ModalHead>

      {error && (
        <UI.ErrorPane text={error?.message} />
      )}

      <UI.Div height={400} opacity={isLoading ? 0.6 : 1}>
        {activeStep === DialogueScheduleStep.INTRO && (
          <IntroStep state={state} onNextStep={nextStep} />
        )}
        {activeStep === DialogueScheduleStep.DATA_PERIOD && (
          <DataPeriodStep
            state={state}
            onNextStep={nextStep}
            onPrevStep={!inEdit ? prevStep : undefined}
          />
        )}
        {activeStep === DialogueScheduleStep.EVAL_PERIOD && (
          <EvalPeriodStep
            state={state}
            onPrevStep={prevStep}
            onNextStep={submit}
          />
        )}
      </UI.Div>
    </UI.Div>
  );
};
