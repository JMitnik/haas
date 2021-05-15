import * as UI from '@haas/ui';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCreateTopicMutation } from 'types/generated-types';


/**
 * Form for creating a topic (usually in a modal).
 */
const CreateTopicForm = ({ onCloseModal }: { onCloseModal: Function }) => {
  const form = useForm();
  const { t } = useTranslation();

  const [createTopic, { loading }] = useCreateTopicMutation({
    onCompleted: () => {
      onCloseModal();
    },
  });

  const handleFormSubmit = ({ label }: { label: string }) => {
    createTopic({
      variables: {
        input: {
          label
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