import * as UI from '@haas/ui';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useGenerateWorkspaceFromCsvMutation } from 'types/generated-types';
import { useHistory } from 'react-router';
import { useLogger } from 'hooks/useLogger';
import { useNavigator } from 'hooks/useNavigator';
import FileDropInput from 'components/FileDropInput';

const schema = yup.object({
  workspaceTitle: yup.string().required(),
  workspaceSlug: yup.string().required(),
}).required();

type FormProps = yup.InferType<typeof schema>;

export const ImportWorkspaceCSVForm = () => {
  const history = useHistory();
  const form = useForm<FormProps>({
    mode: 'all',
  });

  const logger = useLogger();
  const { t } = useTranslation();

  const toast = useToast();

  const [activeCSV, setActiveCSV] = useState<File | null>(null);
  const [importWorkspaceCSV, { loading }] = useGenerateWorkspaceFromCsvMutation({
    onCompleted: () => {
      history.push('/dashboard');
      toast({
        title: t('toast:delivery_imported'),
        description: t('toast:delivery_imported_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: (error) => {
      logger.logError(error, {
        tags: { section: 'campaign' },
      });
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const handleDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveCSV(file);
  };

  const handleSubmit = (formData: FormProps) => {
    console.log('formData: ', formData);
    console.log(activeCSV);
    importWorkspaceCSV({
      variables: {
        input: {
          workspaceTitle: formData.workspaceTitle,
          workspaceSlug: formData.workspaceSlug,
          uploadedCsv: activeCSV,
        },
      },
    });
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.FormSectionHeader>{t('upload_workspace_csv')}</UI.FormSectionHeader>

      <UI.InputGrid>
        <UI.FormControl isRequired>
          <UI.FormLabel>Workspace title</UI.FormLabel>
          <UI.Input name="workspaceTitle" ref={form.register()} placeholder={t('form_helpertext_placeholder')} />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel>Workspace slug</UI.FormLabel>
          <UI.Input name="workspaceSlug" ref={form.register()} placeholder={t('form_helpertext_placeholder')} />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel>{t('upload_workspace_csv')}</UI.FormLabel>
          <UI.FormLabelHelper>{t('upload_workspace_csv_helper')}</UI.FormLabelHelper>
          <FileDropInput
            onDrop={handleDrop}
          />
        </UI.FormControl>
      </UI.InputGrid>
      <UI.Button
        type="submit"
        isDisabled={!form.formState.isValid}
        isLoading={loading}
      >
        {t('save')}

      </UI.Button>
    </UI.Form>
  );
};
