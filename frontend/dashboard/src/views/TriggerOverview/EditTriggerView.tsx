/* eslint-disable radix */
import * as yup from 'yup';
import { FormContainer, PageTitle } from '@haas/ui';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import editTriggerMutation from 'mutations/editTrigger';
import getTriggerQuery from 'queries/getTrigger';

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
  conditions: Array<{ id: string, questionId: { label: string, value: string }, conditionType: string, range: Array<number>, highThreshold: number, lowThreshold: number, matchText: string }>;
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
    questionId: yup.object().shape({
      value: yup.string().required(),
    }),
    conditionType: yup.string().required(),
    range: yup.array().when('conditionType', {
      is: (condition: string) => condition === TriggerConditionType.INNER_RANGE
      || condition === TriggerConditionType.INNER_RANGE,
      then: yup.array().min(2).required(),
      otherwise: yup.array().notRequired(),
    }),
    lowThreshold: yup.string().notRequired().when('conditionType', {
      is: (condition: string) => condition === TriggerConditionType.LOW_THRESHOLD,
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
    highThreshold: yup.number().when('conditionType', {
      is: (conditionType: string) => conditionType === TriggerConditionType.HIGH_THRESHOLD,
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

const EditTriggerView = () => {
  const { triggerId } = useParams<{triggerId: string, customerSlug: string }>();

  const { data: triggerData, error, loading } = useQuery(getTriggerQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: triggerId,
    },
  });

  if (loading) return null;
  if (error) return <><p>{error.message}</p></>;

  const trigger = triggerData?.trigger;

  console.log('trigger: ', trigger);

  return <EditTriggerForm trigger={trigger} />;
};

const EditTriggerForm = ({ trigger }: {trigger: any}) => {
  const { triggerId } = useParams<{triggerId: string, customerSlug: string }>();
  const history = useHistory();
  const { customerSlug } = useParams();
  const { t } = useTranslation();
  const toast = useToast();

  const form = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: trigger.name,
      condition: trigger.conditions[0].type,
      dialogue: {
        label: trigger.relatedDialogue.title,
        value: trigger.relatedDialogue.slug,
      },
      conditions: trigger.conditions.map((condition: any) => (
        {
          id: condition.id,
          questionId: { label: condition.question.title, value: condition.question.id },
          conditionType: condition.type,
          lowThreshold: condition?.minValue ? condition?.minValue / 10 : null,
          highThreshold: condition?.maxValue ? condition.maxValue / 10 : null,
          matchText: condition?.textValue || null,
        })),
      medium: trigger.medium,
      recipients: trigger.recipients.map((recipient: any) => ({ label: `${recipient?.lastName}, ${recipient?.firstName} - E: ${recipient?.email} - P: ${recipient?.phone}`,
        value: recipient?.id })),
      type: trigger.type,
    },
    mode: 'all',
  });

  const [editTrigger, { loading: isLoading, error: serverError }] = useMutation(editTriggerMutation, {
    onCompleted: () => {
      toast({
        title: 'Edited trigger!',
        description: 'Trigger has been edited.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      setTimeout(() => {
        history.push(`/dashboard/b/${customerSlug}/triggers/`);
      }, 400);
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Trigger could not be created.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const getThresholdValue = (conditionType: string, range: Array<number>, value: number, index: number) => {
    if (conditionType === TriggerConditionType.INNER_RANGE || TriggerConditionType.OUTER_RANGE) {
      return range?.[index] ? range[index] * 10 : null;
    }
    return value ? value * 10 : null;
  };

  const onSubmit = (formData: FormDataProps) => {
    const recipients = { ids: formData.recipients?.map((recip) => recip.value).filter((val) => val) };
    const conditions = formData.conditions.map((condition) => (
      {
        id: parseInt(condition?.id),
        questionId: condition.questionId.value,
        type: condition.conditionType,
        minValue: getThresholdValue(condition.conditionType, condition?.range, condition.lowThreshold, 0),
        maxValue: getThresholdValue(condition.conditionType, condition?.range, condition.highThreshold, 1),
        textValue: condition?.matchText || null,
      }));

    const trigger = {
      name: formData.name,
      type: formData?.type,
      medium: formData?.medium,
      conditions,
    };

    editTrigger({
      variables: {
        triggerId,
        trigger,
        recipients,
      },
    });
  };

  return (
    <>
      <PageTitle>{t('views:edit_trigger_view')}</PageTitle>

      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>

        <FormContainer>
          <TriggerForm
            form={form}
            isLoading={isLoading}
            isInEdit
            onFormSubmit={onSubmit}
            serverErrors={serverError}
          />
        </FormContainer>
      </motion.div>
    </>
  );
};

export default EditTriggerView;
