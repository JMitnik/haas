import * as UI from '@haas/ui';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';


const CreateTopicForm = () => {
    const form = useForm();
    const { t } = useTranslation();

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      console.log("Testeste");
    }

    return (
      <UI.Form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <UI.FormSection>
            <UI.FormControl>
                <UI.FormLabel>
                  {t('label')}
                </UI.FormLabel>
                <UI.Input width="100%" name="label" ref={form.register()} placeholder={t('topic_placeholder')} />
            </UI.FormControl>
        </UI.FormSection>

        <UI.Button type="submit">{t('save_topic')}</UI.Button>
      </UI.Form>
    )
}

export default CreateTopicForm;