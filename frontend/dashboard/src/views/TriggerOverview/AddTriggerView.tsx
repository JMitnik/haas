/* eslint-disable radix */
import * as yup from 'yup';
import { FormContainer, PageTitle } from '@haas/ui';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import createTriggerMutation from 'mutations/createTrigger';

import TriggerForm from './TriggerForm';

interface FormDataProps {
  name: string;
  dialogue: {
    label: string;
    value: string;
  };
  type: string;
  medium: string;
  question: {
    label: string;
    value: string;
  };
  conditions: Array<{
    id: string,
    questionId: { label: string, value: string },
    conditionType: {label: string, value: string},
    range: Array<number>,
    highThreshold: number,
    lowThreshold: number,
    matchText: string }>;
  condition: string;
  matchText: string;
  lowThreshold: number;
  highThreshold: number;
  recipients: Array<{
    label: string;
    value: string;
  }>;
}

enum TriggerConditionType {
  LOW_THRESHOLD='LOW_THRESHOLD',
  HIGH_THRESHOLD='HIGH_THRESHOLD',
  INNER_RANGE='INNER_RANGE',
  OUTER_RANGE='OUTER_RANGE',
  TEXT_MATCH='TEXT_MATCH',
}

const schema = yup.object().shape({
  name: yup.string().required(),
  dialogue: yup.object().shape({
    value: yup.string().required(),
  }),
  type: yup.string().required(),
  medium: yup.string().required(),
  conditions: yup.array().min(1).required().of(yup.object().shape({
    questionId: yup.object().shape({
      value: yup.string().required(),
    }),
    conditionType: yup.object().shape({
      value: yup.string().required(),
    }),
    range: yup.array().when('conditionType', {
      is: (condition: { label: string, value: string }) => condition?.value === TriggerConditionType.INNER_RANGE
      || condition?.value === TriggerConditionType.OUTER_RANGE,
      then: yup.array().min(2).required(),
      otherwise: yup.array().notRequired(),
    }),
    lowThreshold: yup.string().notRequired().when('conditionType', {
      is: (condition: { label: string, value: string }) => condition?.value === TriggerConditionType.LOW_THRESHOLD,
      then: yup.string().required(),
      otherwise: yup.string().notRequired().nullable(),
    }),
    highThreshold: yup.number().when('conditionType', {
      is: (conditionType: { label: string, value: string }) => conditionType?.value === TriggerConditionType.HIGH_THRESHOLD,
      then: yup.number().required(),
      otherwise: yup.number().notRequired().nullable(),
    }),
    matchText: yup.string().when('conditionType', {
      is: (conditionType: { label: string, value: string }) => conditionType?.value === TriggerConditionType.TEXT_MATCH,
      then: yup.string().required(),
      otherwise: yup.string().notRequired().nullable(),
    }),
  })),
  recipients: yup.array().min(1).required().of(yup.object().shape({
    value: yup.string().required(),
  })),
});

const AddTriggerView = () => {
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      conditions: [],
    },
  });

  const toast = useToast();

  const { t } = useTranslation();

  const { customerSlug } = useParams();

  const [addTrigger, { loading: isLoading, error: serverError }] = useMutation(createTriggerMutation, {
    onCompleted: () => {
      toast({
        title: 'Created trigger!',
        description: 'Trigger has been created and assigned.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      setTimeout(() => {
        history.push(`/dashboard/b/${customerSlug}/triggers/`);
      }, 1000);
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to make trigger. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const getThresholdValue = (conditionType: string, range: Array<number>, value: number, index: number) => {
    if (conditionType === TriggerConditionType.INNER_RANGE || conditionType === TriggerConditionType.OUTER_RANGE) {
      return range?.[index] ? range[index] * 10 : null;
    }
    return value ? value * 10 : null;
  };

  const onSubmit = (formData: FormDataProps) => {
    const recipients = { ids: formData.recipients?.map((recip) => recip.value).filter((val) => val) };
    const conditions = formData.conditions.map((condition) => (
      {
        questionId: condition.questionId.value,
        type: condition.conditionType?.value,
        minValue: getThresholdValue(condition.conditionType?.value, condition?.range, condition.lowThreshold, 0),
        maxValue: getThresholdValue(condition.conditionType?.value, condition?.range, condition.highThreshold, 1),
        textValue: condition?.matchText || null,
      }));
    const trigger = {
      name: formData.name,
      type: formData?.type,
      medium: formData?.medium,
      conditions,
    };

    const input = { trigger, recipients, customerSlug };

    addTrigger({
      variables: {
        input,
      },
    });
  };

  return (
    <>
      <PageTitle>{t('views:create_trigger_view')}</PageTitle>

      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>

        <FormContainer>
          <TriggerForm
            form={form}
            isLoading={isLoading}
            onFormSubmit={onSubmit}
            serverErrors={serverError}
          />
        </FormContainer>
      </motion.div>

    </>
  );
};

export default AddTriggerView;
