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
  highThreshold: yup.string().notRequired().when(['condition'], {
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
  recipients: yup.array().of(yup.object().shape({
    value: yup.string().required(),
    label: yup.string().required(),
  })).notRequired(),
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
        label: trigger.relatedNode.questionDialogue.title,
        value: trigger.relatedNode.questionDialogue.slug,
      },
      highThreshold: trigger.conditions[0].maxValue / 10,
      lowThreshold: trigger.conditions[0].minValue / 10,
      matchText: trigger.conditions[0].textValue,
      medium: trigger.medium,
      question: {
        label: trigger.relatedNode.title,
        value: trigger.relatedNode.id,
      },
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

    editTrigger({
      variables: {
        triggerId,
        questionId,
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
