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
  conditions: Array<{ questionId: { label: string, value: string }, conditionType: string, highThreshold: number, lowThreshold: number, matchText: string }>;
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

enum TriggerQuestionType {
  QUESTION='QUESTION',
  SCHEDULED='SCHEDULED',
}

const schema = yup.object().shape({
  name: yup.string().required(),
  dialogue: yup.string().required(),
  type: yup.string().required(),
  medium: yup.string().required(),
  conditions: yup.array().min(1).required().of(yup.object().shape({
    questionId: yup.string().required(),
    conditionType: yup.string().required(),
    lowThreshold: yup.string().notRequired().when('conditionType', {
      is: (condition: string) => condition === TriggerConditionType.LOW_THRESHOLD
      || condition === TriggerConditionType.INNER_RANGE
      || condition === TriggerConditionType.OUTER_RANGE,
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
    highThreshold: yup.number().when('conditionType', {
      is: (conditionType: string) => conditionType === TriggerConditionType.HIGH_THRESHOLD
        || conditionType === TriggerConditionType.INNER_RANGE
        || conditionType === TriggerConditionType.OUTER_RANGE,
      then: yup.number().required(),
      otherwise: yup.number().notRequired(),
    }),
    matchText: yup.string().when('conditionType', {
      is: (conditionType: string) => conditionType === TriggerConditionType.TEXT_MATCH,
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
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

  const onSubmit = (formData: FormDataProps) => {
    // TODO: Remove questionId from AddTriggerInput
    // const questionId = formData.question.value;
    const recipients = { ids: formData.recipients?.map((recip) => recip.value).filter((val) => val) };
    const conditions = formData.conditions.map((condition) => (
      {
        // TODO: Add questionID to ConditionsInput
        questionId: condition.questionId,
        type: condition.conditionType,
        minValue: condition?.lowThreshold ? condition?.lowThreshold * 10 : null,
        maxValue: condition?.highThreshold ? condition.highThreshold * 10 : null,
        textValue: condition?.matchText || null,
      }));
    const trigger = {
      name: formData.name,
      type: formData?.type,
      medium: formData?.medium,
      conditions,
    };

    addTrigger({
      variables: {
        customerSlug,
        trigger,
        recipients,
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
