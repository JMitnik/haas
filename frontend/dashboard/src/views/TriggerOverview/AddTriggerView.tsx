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
  question: yup.object().shape({
    value: yup.string().when(['type'], {
      is: (type: string) => type === TriggerQuestionType.QUESTION,
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
  }),
  condition: yup.string().required(),
  lowThreshold: yup.string().notRequired().when(['condition'], {
    is: (condition: string) => condition === TriggerConditionType.LOW_THRESHOLD
    || condition === TriggerConditionType.INNER_RANGE
    || condition === TriggerConditionType.OUTER_RANGE,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  highThreshold: yup.string().when(['condition'], {
    is: (condition: string) => condition === TriggerConditionType.HIGH_THRESHOLD
    || condition === TriggerConditionType.INNER_RANGE
    || condition === TriggerConditionType.OUTER_RANGE,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  matchText: yup.string().when(['condition'], {
    is: (parentQuestionType: string) => parentQuestionType === TriggerConditionType.TEXT_MATCH,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  recipients: yup.array().min(1).of(yup.object().shape({
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
    const questionId = formData.question.value;
    const recipients = { ids: formData.recipients?.map((recip) => recip.value).filter((val) => val) };

    const trigger = {
      name: formData.name,
      type: formData?.type,
      medium: formData?.medium,
      conditions: [{
        type: formData.condition,
        minValue: formData.lowThreshold * 10,
        maxValue: formData.highThreshold * 10,
        textValue: formData.matchText,
      }],
    };

    addTrigger({
      variables: {
        customerSlug,
        questionId,
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
