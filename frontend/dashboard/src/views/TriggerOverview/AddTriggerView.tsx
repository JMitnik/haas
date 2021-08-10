/* eslint-disable radix */
import * as UI from '@haas/ui';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import createTriggerMutation from 'mutations/createTrigger';

import { useNavigator } from 'hooks/useNavigator';
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
    conditionType: string,
    range: Array<number>,
    highThreshold: number,
    lowThreshold: number,
    matchText: string
  }>;
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
  LOW_THRESHOLD = 'LOW_THRESHOLD',
  HIGH_THRESHOLD = 'HIGH_THRESHOLD',
  INNER_RANGE = 'INNER_RANGE',
  OUTER_RANGE = 'OUTER_RANGE',
  TEXT_MATCH = 'TEXT_MATCH',
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
    conditionType: yup.string(),
    range: yup.array().when('conditionType', {
      is: (condition: string) => condition === TriggerConditionType.INNER_RANGE
        || condition === TriggerConditionType.OUTER_RANGE,
      then: yup.array().min(2).required(),
      otherwise: yup.array().notRequired(),
    }),
    lowThreshold: yup.string().notRequired().when('conditionType', {
      is: (condition: string) => condition === TriggerConditionType.LOW_THRESHOLD,
      then: yup.string().required(),
      otherwise: yup.string().notRequired().nullable(),
    }),
    highThreshold: yup.number().when('conditionType', {
      is: (conditionType: string) => conditionType === TriggerConditionType.HIGH_THRESHOLD,
      then: yup.number().required(),
      otherwise: yup.number().notRequired().nullable(),
    }),
    matchText: yup.string().when('conditionType', {
      is: (conditionType: string) => conditionType === TriggerConditionType.TEXT_MATCH,
      then: yup.string().required(),
      otherwise: yup.string().notRequired().nullable(),
    }),
  })),
  recipients: yup.array().min(1).required().of(yup.object().shape({
    value: yup.string().required(),
  })),
});

const AddTriggerView = () => {
  const { getAlertsPath } = useNavigator();
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

  const { customerSlug } = useParams<{ customerSlug: string }>();

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
    const conditions = formData.conditions?.map((condition) => ({
      questionId: condition.questionId.value,
      type: condition.conditionType,
      minValue: getThresholdValue(condition.conditionType, condition?.range, condition.lowThreshold, 0),
      maxValue: getThresholdValue(condition.conditionType, condition?.range, condition.highThreshold, 1),
      textValue: condition?.matchText || null,
    })) || [];
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
      <UI.ViewHead renderBreadCrumb={(
        <UI.Breadcrumb to={getAlertsPath()}>{t('go_to_alerts')}</UI.Breadcrumb>
      )}
      >
        <UI.ViewTitle>{t('views:create_trigger_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>

          <UI.FormContainer>
            <TriggerForm
              form={form}
              isLoading={isLoading}
              onFormSubmit={onSubmit}
              serverErrors={serverError}
            />
          </UI.FormContainer>
        </motion.div>
      </UI.ViewBody>

    </>
  );
};

export default AddTriggerView;
