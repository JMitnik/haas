import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as RadioGroup from 'components/Common/RadioGroup';
import { DialogueTemplateType, refetchMeQuery, useGenerateWorkspaceFromCsvMutation } from 'types/generated-types';
import { View } from 'layouts/View';
import { useLogger } from 'hooks/useLogger';
import { useToast } from 'hooks/useToast';
import FileDropInput from 'components/FileDropInput';
import intToBool from 'utils/intToBool';

const schema = yup.object({
  workspaceTitle: yup.string().required(),
  workspaceSlug: yup.string().required(),
  dialogueType: yup.string().required(),
  generateDemoData: yup.number().required(),
  isDemo: yup.number().required(),
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
    label: 'Teacher template',
    description: 'For teacher-related dialogues.',
    value: DialogueTemplateType.TeacherEng,
  },
  {
    label: 'Student Template (English)',
    description: 'For student-related dialogues.',
    value: DialogueTemplateType.StudentEng,
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
  {
    label: 'Student Template (Dutch)',
    description: 'For dutch student-related dialogues.',
    value: DialogueTemplateType.StudentNl,
  },
  {
    label: 'Teacher Template (Dutch)',
    description: 'For dutch teacher-related dialogues.',
    value: DialogueTemplateType.TeacherNl,
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
  const [activeManagerCSV, setActiveManagerCSV] = useState<File | null>(null);
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
      console.log('ERROR: ', error);
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

  const isDemoWatch = useWatch({
    control: form.control,
    name: 'isDemo',
    defaultValue: 0,
  });

  const handleManagerCancel = () => {
    setActiveManagerCSV(null);
  };

  const handleGroupsCancel = () => {
    setActiveCSV(null);
  };

  const handleManagerDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveManagerCSV(file);
  };

  const handleDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveCSV(file);
  };

  const handleSubmit = (formData: FormProps) => {
    const { workspaceTitle, workspaceSlug, dialogueType, generateDemoData, isDemo } = formData;
    const generateDemoDataCheck = intToBool(generateDemoData);
    const isDemoCheck = intToBool(isDemo);

    importWorkspaceCSV({
      variables: {
        input: {
          workspaceTitle,
          workspaceSlug,
          uploadedCsv: activeCSV,
          managerCsv: activeManagerCSV,
          type: dialogueType as DialogueTemplateType,
          generateDemoData: generateDemoDataCheck,
          isDemo: isDemoCheck,
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
                  <RadioGroup.Root
                    defaultValue={value}
                    onValueChange={onChange}
                    onBlur={onBlur}
                    variant="spaced"
                  >
                    {DIALOGUE_TYPE_OPTIONS.map((option) => (
                      <RadioGroup.Item
                        isActive={value === option.value}
                        value={option.value}
                        key={option.value}
                        contentVariant="twoLine"
                        variant="boxed"
                      >
                        <RadioGroup.Label>
                          {option.label}
                        </RadioGroup.Label>
                        <RadioGroup.Subtitle>
                          {option.description}
                        </RadioGroup.Subtitle>
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup.Root>
                )}
              />
            </UI.FormControl>

            <UI.FormControl>
              <UI.Flex alignItems="center">
                <UI.Div>
                  <UI.FormLabel>{t('make_demo_workspace')}</UI.FormLabel>
                  <UI.InputHelper>{t('make_demo_workspace_helper')}</UI.InputHelper>
                </UI.Div>

                <UI.Div ml={120}>
                  <Controller
                    control={form.control}
                    name="isDemo"
                    defaultValue={0}
                    render={({ onChange, value, onBlur }) => (
                      <UI.Toggle
                        size="lg"
                        onChange={() => {
                          if (value === 1) {
                            form.setValue('generateDemoData', 0);
                          }
                          return (value === 1 ? onChange(0) : onChange(1));
                        }}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                  />
                </UI.Div>

              </UI.Flex>

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
                    render={({ onChange, value, onBlur }) => (
                      <UI.Toggle
                        isDisabled={isDemoWatch !== 1}
                        isChecked={value === 1}
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

            <UI.FormControl>
              <UI.FormLabel>{t('upload_user_csv')}</UI.FormLabel>
              <UI.FormLabelHelper>{t('upload_user_csv_helper')}</UI.FormLabelHelper>
              <FileDropInput
                onDrop={handleManagerDrop}
                onCancel={handleManagerCancel}
              />
            </UI.FormControl>

            <UI.FormControl>
              <UI.FormLabel>{t('upload_workspace_csv')}</UI.FormLabel>
              <UI.FormLabelHelper>{t('upload_workspace_csv_helper')}</UI.FormLabelHelper>
              <FileDropInput
                onDrop={handleDrop}
                onCancel={handleGroupsCancel}
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
      </UI.ViewBody>
    </View>
  );
};
