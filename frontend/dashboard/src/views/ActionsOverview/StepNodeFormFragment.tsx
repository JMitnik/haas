import * as UI from '@haas/ui';
import { AnimatePresence } from 'framer-motion';
import { XCircle } from 'react-feather';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import * as Modal from 'components/Common/Modal';
import { ReactComponent as FieldIll } from 'assets/images/undraw_form.svg';

import { FormNodeFieldFragment } from './FormNodeFieldFragment';
import { FormNodePreview } from './FormNodePreview';
import { TempFieldType } from './FormNodeForm.types';

interface StepFormNodeFormProps {
  position: number;
  onClose: (value: React.SetStateAction<number | null>) => void;
  onDelete: () => void
}

interface TempFieldProps {
  label: string | null;
  position: number;
  type: TempFieldType | null;
  isRequired: number;
  contact: { contacts: any[] };
}

const appendNewField = (index: number): TempFieldProps => ({
  label: null,
  position: index,
  type: null,
  isRequired: 0,
  contact: { contacts: [] },
});

export const StepFormNodeFormFragment = ({ position, onClose, onDelete }: StepFormNodeFormProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const form = useFormContext();
  const [openedField, setOpenedField] = useState<number | null>(null);
  const { t } = useTranslation();

  const { fields, append, move, remove } = useFieldArray({
    name: `formNode.steps.${position}.fields`,
    control: form.control,
    keyName: 'fieldIndex',
  });

  const handleNewField = () => {
    append(appendNewField(fields.length + 1));
  };

  const formNodeFields = form.watch(`formNode.steps.${position}.fields`, []);

  return (
    <UI.Card padding="2em" zIndex={299} ref={ref}>
      <UI.Flex mb={2} justifyContent="space-between">
        <UI.H4 color="main.500">
          Step
          {' '}
          {position + 1}
        </UI.H4>
        <UI.Icon style={{ cursor: 'pointer' }} color="main.500" onClick={() => onClose(null)}>
          <XCircle />
        </UI.Icon>
      </UI.Flex>

      <UI.Grid gridTemplateColumns="1fr 1fr">
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="header">{t('step_header')}</UI.FormLabel>
          <UI.InputHelper>{t('step_header_helper')}</UI.InputHelper>
          <UI.Input id="header" {...form.register(`formNode.steps.${position}.header`)} placeholder="Contact Details" />
        </UI.FormControl>
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="helper">{t('step_helper')}</UI.FormLabel>
          <UI.InputHelper>{t('step_helper_helper')}</UI.InputHelper>
          <UI.Input id="helper" {...form.register(`formNode.steps.${position}.helper`)} placeholder={t('form_helpertext_placeholder')} />
        </UI.FormControl>
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="subHelper">{t('step_sub_helper')}</UI.FormLabel>
          <UI.InputHelper>{t('step_sub_helper_helper')}</UI.InputHelper>
          <UI.Input id="subHelper" {...form.register(`formNode.steps.${position}.subHelper`)} placeholder="Please fill in your details..." />
        </UI.FormControl>
      </UI.Grid>
      <UI.Grid mt={4} gridTemplateColumns="1fr 1fr">
        {fields?.map((field, index) => (
          <UI.Div position="relative" key={field.fieldIndex}>
            <AnimatePresence>
              {openedField === index && (
                <Modal.Root
                  open={openedField === index}
                  onClose={() => setOpenedField(null)}
                  style={{ maxWidth: 1000 }}
                >
                  <FormNodeFieldFragment
                    onClose={() => setOpenedField(null)}
                    onDelete={() => remove(index)}
                    field={formNodeFields[index]}
                    fieldIndex={index}
                    stepIndex={position}
                    key={field.fieldIndex}
                  />
                </Modal.Root>
              )}

            </AnimatePresence>

            <FormNodePreview
              fieldIndex={index}
              nrFields={fields.length}
              field={formNodeFields[index]}
              onOpen={() => setOpenedField(index)}
              onMoveLeft={() => move(index, Math.max(index - 1, 0))}
              onMoveRight={() => {
                move(index, Math.min(index + 1, fields.length - 1));
              }}
            />
          </UI.Div>
        ))}
      </UI.Grid>

      {
        fields.length === 0 ? (
          <UI.IllustrationCard svg={<FieldIll />} text={t('add_field_reminder')}>
            <UI.Button type="button" onClick={() => handleNewField()}>{t('add_field')}</UI.Button>
            or
            <UI.Button
              onClick={() => onDelete()}
              variantColor="red"
              variant="outline"
            >
              {t('delete_step')}

            </UI.Button>
          </UI.IllustrationCard>
        ) : (
          <UI.Flex mt={4} justifyContent="space-between">
            <UI.Button type="button" onClick={() => handleNewField()}>{t('add_field')}</UI.Button>
          </UI.Flex>

        )
      }
    </UI.Card>
  );
};
