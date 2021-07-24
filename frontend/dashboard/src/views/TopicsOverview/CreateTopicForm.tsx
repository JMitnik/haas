import * as UI from '@haas/ui';
import { useCustomer } from 'providers/CustomerProvider';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { GetTopicsOfDialogueDocument, useCreateTopicMutation } from 'types/generated-types';

/**
 * Form for creating a topic (usually in a modal).
 */
const CreateTopicForm = ({ onCloseModal }: { onCloseModal: Function }) => {
  const form = useForm({
    defaultValues: {
      topicValues: [],
    },
  });

  const topicValuesForm = useFieldArray({
    name: 'topicValues',
    control: form.control,
    keyName: 'childIndex',
  });

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
        dialogueSlug,
      },
    }],
  });

  const handleFormSubmit = ({ label }: { label: string }) => {
    createTopic({
      variables: {
        input: {
          label,
          relatedDialogueSlug: dialogueSlug,
          customerId: activeCustomer?.id || '',
          topicValues: form.getValues().topicValues,
        },
      },
    });
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <UI.InputGrid>
        <UI.FormControl isRequired>
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

        <UI.FormControl>
          <UI.FormLabel>
            {t('topic_values')}
          </UI.FormLabel>

          {topicValuesForm.fields.map((topicValue, index) => (
            <UI.Div key={topicValue.childIndex}>
              <UI.Input
                name={`topicValues.${index}.label`}
                ref={form.register()}
                defaultValue={topicValue.label}
                placeholder={t('create_topic_value_placeholder')}
                mb={2}
              />
            </UI.Div>
          ))}

          <UI.Flex mt={2}>

            <UI.Button size="sm" onClick={() => topicValuesForm.append({ label: '' })}>
              Add topic value
            </UI.Button>
          </UI.Flex>

        </UI.FormControl>

      </UI.InputGrid>

      <UI.Hr />

      <UI.Button background="teal" color="white" isLoading={loading} type="submit">{t('save_topic')}</UI.Button>
    </UI.Form>
  );
};

export default CreateTopicForm;
