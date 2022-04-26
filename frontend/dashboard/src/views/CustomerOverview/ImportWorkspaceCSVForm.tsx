import * as UI from '@haas/ui';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { refetchMeQuery, useGenerateWorkspaceFromCsvMutation } from 'types/generated-types';
import { useLogger } from 'hooks/useLogger';
import { useToast } from 'hooks/useToast';
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
    refetchQueries: [
      refetchMeQuery(),
    ],
    onCompleted: () => {
      history.push('/dashboard');
      toast.success({
        description: t('toast:workspace_generated_helper'),
      });
    },
    onError: (error) => {
      logger.logError(error, {
        tags: { section: 'campaign' },
      });
      toast.templates.error();
    },
  });

  const handleDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveCSV(file);
  };

  const handleSubmit = (formData: FormProps) => {
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
    <UI.Container>
      <UI.SectionHeader mb={2}>{t('upload_workspace_csv')}</UI.SectionHeader>

      <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>

        <UI.InputGrid>
          <UI.FormControl isRequired>
            <UI.FormLabel>{t('workspace_title')}</UI.FormLabel>
            <UI.Input
              name="workspaceTitle"
              ref={form.register()}
              placeholder={t('default_values:workspace_placeholder')}
            />
          </UI.FormControl>

          <UI.FormControl isRequired>
            <UI.FormLabel>{t('workspace_slug')}</UI.FormLabel>

            <UI.Input
              placeholder={t('default_values:workspace_slug')}
              leftAddOn="https://client.haas.live/"
              name="workspaceSlug"
              ref={form.register({ required: true })}
            />
          </UI.FormControl>

          <UI.FormControl isRequired>
            <UI.FormLabel>{t('upload_workspace_csv')}</UI.FormLabel>
            <UI.FormLabelHelper>{t('upload_workspace_csv_helper')}</UI.FormLabelHelper>
            <FileDropInput
              onDrop={handleDrop}
            />
          </UI.FormControl>
        </UI.InputGrid>
        <UI.Flex justifyContent="flex-end">
          <UI.Button
            mt={4}
            variantColor="main"
            type="submit"
            isDisabled={!form.formState.isValid}
            isLoading={loading}
          >
            {t('save')}
          </UI.Button>
        </UI.Flex>
      </UI.Form>
    </UI.Container>
  );
};
