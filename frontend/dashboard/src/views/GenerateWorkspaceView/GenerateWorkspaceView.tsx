import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { DialogueTemplateType, refetchMeQuery, useGenerateWorkspaceFromCsvMutation } from 'types/generated-types';
import { View } from 'layouts/View';
import { useLogger } from 'hooks/useLogger';
import { useToast } from 'hooks/useToast';
import FileDropInput from 'components/FileDropInput';
import intToBool from 'utils/intToBool';

import * as LS from './GenerateWorkspaceView.styles';

const schema = yup.object({
  workspaceTitle: yup.string().required(),
  workspaceSlug: yup.string().required(),
  dialogueType: yup.string().required(),
  generateDemoData: yup.number().required(),
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

  const usesGeneratedData = useWatch({
    control: form.control,
    name: 'generateDemoData',
    defaultValue: 0,
  });

  console.log({ usesGeneratedData });

  const handleDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveCSV(file);
  };

  const handleSubmit = (formData: FormProps) => {
    const { workspaceTitle, workspaceSlug, dialogueType, generateDemoData } = formData;
    const generateDemoDataCheck = intToBool(generateDemoData);

    importWorkspaceCSV({
      variables: {
        input: {
          workspaceTitle,
          workspaceSlug,
          uploadedCsv: activeCSV,
          type: dialogueType as DialogueTemplateType,
          generateDemoData: generateDemoDataCheck,
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
                {...form.register('workspaceTitle')}
                placeholder={t('default_values:workspace_placeholder')}
              />
            </UI.FormControl>

            <UI.FormControl isRequired>
              <UI.FormLabel>{t('workspace_slug')}</UI.FormLabel>

              <UI.Input
                placeholder={t('default_values:workspace_slug')}
                leftAddOn="https://client.haas.live/"
                {...form.register('workspaceSlug', { required: true })}
              />
            </UI.FormControl>

            <UI.FormControl isRequired>
              <UI.FormLabel htmlFor="dialogueType">{t('template')}</UI.FormLabel>
              <Controller
                name="dialogueType"
                control={form.control}
                render={({ field: { value, onChange, onBlur } }) => (
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

            <UI.FormControl>
              <UI.Flex alignItems="center">
                <UI.Div>
                  <UI.FormLabel>{t('create_demo_data')}</UI.FormLabel>
                  <UI.InputHelper>{t('create_demo_data_helper')}</UI.InputHelper>
                </UI.Div>

                <UI.Div ml={120}>
                  <Controller
                    control={form.control}
                    name="generateDemoData"
                    defaultValue={0}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <UI.Toggle
                        size="lg"
                        onChange={() => (value === 1 ? onChange(0) : onChange(1))}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </UI.Div>

              </UI.Flex>

            </UI.FormControl>

            <UI.FormControl isRequired={usesGeneratedData === 0} opacity={usesGeneratedData ? 0.5 : 1}>
              <UI.FormLabel>{t('upload_workspace_csv')}</UI.FormLabel>
              <UI.FormLabelHelper>{t('upload_workspace_csv_helper')}</UI.FormLabelHelper>
              <FileDropInput
                isDisabled={!!usesGeneratedData}
                onDrop={handleDrop}
              />
            </UI.FormControl>
          </UI.InputGrid>
          <UI.Flex justifyContent="flex-end">
            <UI.Button
              mt={4}
              variantColor="main"
              type="submit"
              isDisabled={!form.formState.isValid || (usesGeneratedData === 0 && !activeCSV)}
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
