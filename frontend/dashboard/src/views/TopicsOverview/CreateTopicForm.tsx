import * as UI from '@haas/ui';
import { useNavigator } from 'hooks/useNavigator';
import { useCustomer } from 'providers/CustomerProvider';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { GetTopicsOfDialogueDocument, useCreateTopicMutation } from 'types/generated-types';


/**
 * Form for creating a topic (usually in a modal).
 */
const CreateTopicForm = ({ onCloseModal }: { onCloseModal: Function }) => {
  const form = useForm();
  const { t } = useTranslation();
  const { dialogueSlug } = useNavigator();
  const { activeCustomer } = useCustomer();

  const [createTopic, { loading }] = useCreateTopicMutation({
    onCompleted: () => {
      onCloseModal();
    },
    refetchQueries: [{
      query: GetTopicsOfDialogueDocument,
      variables: {
        customerId: activeCustomer?.id || '',
        dialogueSlug
      }
    }]
  });

  const handleFormSubmit = ({ label }: { label: string }) => {
    createTopic({
      variables: {
        input: {
          label,
          relatedDialogueSlug: dialogueSlug,
          customerId: activeCustomer?.id || ''
        }
      }
    });
  }

  return (
    <UI.Form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <UI.FormSection>
        <UI.FormControl>
          <UI.FormLabel>
            {t('label')}
          </UI.FormLabel>
          <UI.Input
            width="100%"
            name="label"
            ref={form.register()}
            placeholder={t('topic_placeholder')}
          />
        </UI.FormControl>
      </UI.FormSection>

      <UI.Button isLoading={loading} type="submit">{t('save_topic')}</UI.Button>
    </UI.Form>
  );
}

export default CreateTopicForm;