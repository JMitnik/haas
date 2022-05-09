import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { DialogueTemplateType, refetchMeQuery, useGenerateWorkspaceFromCsvMutation } from 'types/generated-types';
import { View } from 'layouts/View';
import { useLogger } from 'hooks/useLogger';
import { useToast } from 'hooks/useToast';
import FileDropInput from 'components/FileDropInput';

import * as LS from './GenerateWorkspaceView.styles';

const schema = yup.object({
  workspaceTitle: yup.string().required(),
  workspaceSlug: yup.string().required(),
  dialogueType: yup.string().required(),
}).required();

type FormProps = yup.InferType<typeof schema>;

const DIALOGUE_TYPE_OPTIONS = [
  {
    label: 'Default',
    description: 'The original haas dialogue, regarding Facilities, Cleanliness, and co.',
    value: DialogueTemplateType.Default,
  },
  {
    label: 'Business Template',
    description: 'For business-related dialogues.',
    value: DialogueTemplateType.BusinessEng,
  },
  {
    label: 'Sport team (English)',
    description: 'The Club Hades sports team model (in English).',
    value: DialogueTemplateType.SportEng,
  },
  {
    label: 'Sport team (Dutch)',
    description: 'The Club Hades sports team model (in Dutch).',
    value: DialogueTemplateType.SportNl,
  },
];

export const GenerateWorkspaceView = () => {
  const history = useHistory();
  const form = useForm<FormProps>({
    mode: 'all',
    defaultValues: {
      dialogueType: DialogueTemplateType.Default,
    },
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
    const { workspaceTitle, workspaceSlug, dialogueType } = formData;
    importWorkspaceCSV({
      variables: {
        input: {
          workspaceTitle,
          workspaceSlug,
          uploadedCsv: activeCSV,
          type: dialogueType as DialogueTemplateType,
        },
      },
    });
  };

  return (
    <View documentTitle="haas | Generate workspace">
      <UI.ViewHead compact>
        <UI.ViewTitle>
          {t('generate_workspace')}
        </UI.ViewTitle>
        <UI.ViewSubTitle>
          {t('generate_workspace_subtitle')}
        </UI.ViewSubTitle>
      </UI.ViewHead>
      <UI.ViewBody compact>
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
              <UI.FormLabel htmlFor="dialogueType">{t('template')}</UI.FormLabel>
              <Controller
                name="dialogueType"
                control={form.control}
                render={({ value, onChange, onBlur }) => (
                  <LS.RadioGroupRoot
                    defaultValue={value}
                    onValueChange={onChange}
                    onBlur={onBlur}
                    variant="spaced"
                  >
                    {DIALOGUE_TYPE_OPTIONS.map((option) => (
                      <LS.RadioGroupBox
                        htmlFor={option.value}
                        key={option.value}
                        isActive={value === option.value}
                        contentVariant="twoLine"
                        variant="boxed"
                      >
                        <LS.RadioGroupItem id={option.value} key={option.value} value={option.value}>
                          <LS.RadioGroupIndicator />
                        </LS.RadioGroupItem>
                        <UI.Div>
                          <LS.RadioGroupLabel>
                            {option.label}
                          </LS.RadioGroupLabel>
                          <LS.RadioGroupSubtitle>
                            {option.description}
                          </LS.RadioGroupSubtitle>
                        </UI.Div>
                      </LS.RadioGroupBox>
                    ))}
                  </LS.RadioGroupRoot>
                )}
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
              isDisabled={!form.formState.isValid || !activeCSV}
              isLoading={loading}
            >
              {t('save')}
            </UI.Button>
          </UI.Flex>
        </UI.Form>
      </UI.ViewBody>
    </View>
  );
};
