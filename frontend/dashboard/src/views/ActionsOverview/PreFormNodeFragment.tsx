import * as UI from '@haas/ui';
import * as yup from 'yup';
import { XCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef } from 'react';

import useOnClickOutside from 'hooks/useClickOnOutside';

interface StepFormNodeFormProps {
  onSubmit: (subForm: any) => void;
  onClose: (value: React.SetStateAction<number | null>) => void;
  preFormNode: any;
}

interface PreFormNodeData {
  header: string;
  helper: string;
  nextText: string;
  finishText: string;
}

export const schema = yup.object().shape({
  header: yup.string().required(),
  helper: yup.string().required(),
  nextText: yup.string().required(),
  finishText: yup.string().required(),
});

export const PreFormNodeFormFragment = ({ onClose, onSubmit, preFormNode }: StepFormNodeFormProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const subForm = useForm<PreFormNodeData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
  });
  const { t } = useTranslation();

  const handleSaveValues = () => {
    onSubmit(subForm.getValues());
    onClose(null);
  };

  useOnClickOutside(ref, () => onClose(null));

  return (
    <UI.Card padding="2em" zIndex={299} ref={ref}>
      <UI.Flex mb={2} justifyContent="space-between">
        <UI.H4 color="main.500">
          Pre-Form Node
        </UI.H4>
        <UI.Icon style={{ cursor: 'pointer' }} color="main.500" onClick={() => onClose(null)}>
          <XCircle />
        </UI.Icon>
      </UI.Flex>

      <UI.Grid gridTemplateColumns="1fr 1fr">
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="header">{t('pre_form_header')}</UI.FormLabel>
          <UI.InputHelper>{t('pre_form_header_helper')}</UI.InputHelper>
          <UI.Input
            id="header"
            defaultValue={preFormNode?.header}
            {...subForm.register('header', { required: true })}
            placeholder="Contact Details"
          />
        </UI.FormControl>
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="helper">{t('pre_form_helper')}</UI.FormLabel>
          <UI.InputHelper>{t('pre_form_helper_helper')}</UI.InputHelper>
          <UI.Input
            id="helper"
            defaultValue={preFormNode?.helper}
            {...subForm.register('helper')}
            placeholder={t('form_helpertext_placeholder')}
          />
        </UI.FormControl>
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="nextText">{t('pre_form_next_text')}</UI.FormLabel>
          <UI.InputHelper>{t('pre_form_next_text_helper')}</UI.InputHelper>
          <UI.Input
            id="nextText"
            defaultValue={preFormNode?.nextText}
            {...subForm.register('nextText')}
            placeholder="Please fill in your details..."
          />
        </UI.FormControl>
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="finishText">{t('pre_form_finish_text')}</UI.FormLabel>
          <UI.InputHelper>{t('pre_form_finish_text_helper')}</UI.InputHelper>
          <UI.Input
            id="finishText"
            defaultValue={preFormNode?.finishText}
            {...subForm.register('finishText')}
            placeholder="Please fill in your details..."
          />
        </UI.FormControl>
        <UI.Div>
          <UI.Button isDisabled={!subForm.formState.isValid} onClick={handleSaveValues}>{t('save_pre_form')}</UI.Button>
        </UI.Div>
      </UI.Grid>

    </UI.Card>
  );
};
