import * as UI from '@haas/ui';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { title } from 'process';
import { type } from 'os';
import { yupResolver } from '@hookform/resolvers';
import CTAForm, { stopPropagate } from 'views/ActionsOverview/CTAForm';
import boolToInt from 'utils/booleanToNumber';

interface NewCTAModalCardProps {
  onClose: () => void;
  onSuccess: (data?: any) => void;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  questionType: yup.string().required(),
  videoEmbedded: yup.string().when(['questionType'], {
    is: (questionType: string) => questionType === 'VIDEO_EMBEDDED',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  matchText: yup.string().when(['parentQuestionType'], {
    is: (parentQuestionType: string) => parentQuestionType === 'Choice',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  optionsFull: yup.array().when(['questionType'], {
    is: (questionType: string) => isChoiceType(questionType),
    then: yup.array().min(1).of(yup.object({
      value: yup.string().required('form.value_required'),
    })),
    otherwise: yup.array().notRequired(),
  }),
});

export interface FormDataProps {
  title: string;
  ctaType: { label: string, value: string };
  links: Array<{
    id?: string | null;
    title: string;
    type?: string | null;
    url: string;
    iconUrl?: string;
    backgroundColor?: string;
    header?: string;
    subHeader?: string;
    imageUrl?: string;
    buttonText?: string;
  }>;
  share: { id?: string, tooltip: string, url: string, title: string };
  formNode?: {
    id?: string;
    helperText?: string;
    fields: {
      id?: string;
      placeholder: string;
      label: string;
      type: string;
      isRequired: boolean;
      position: number;
    }[];
  };
}

export const CreateConditionModalCard = ({ onClose, onSuccess }: NewCTAModalCardProps) => {
  const { t } = useTranslation();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
    },
  });

  const onSubmit = (formData: FormDataProps) => { };

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose}>
      <UI.ModalHead>
        <UI.ModalTitle>
          Create new CTA
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <UI.FormContainer expandedForm>
          <UI.Form onSubmit={stopPropagate(form.handleSubmit(onSubmit))}>
            <UI.Div>
              <UI.FormSection id="general">
                <UI.Div>
                  <UI.FormSectionHeader>{t('about_call_to_action')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>{t('cta:information_header')}</UI.FormSectionHelper>
                </UI.Div>
                <UI.Div>
                  <UI.InputGrid>
                    <UI.FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.errors.title}>
                      <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
                      <UI.InputHelper>{t('cta:title_helper')}</UI.InputHelper>
                      <Controller
                        name="title"
                        control={form.control}
                        defaultValue={title}
                        render={({ value, onChange }) => (
                          <UI.MarkdownEditor
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                      <UI.ErrorMessage>{form.errors.title?.message}</UI.ErrorMessage>
                    </UI.FormControl>
                  </UI.InputGrid>
                </UI.Div>
              </UI.FormSection>
            </UI.Div>
          </UI.Form>
        </UI.FormContainer>
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
