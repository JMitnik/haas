import * as UI from '@haas/ui';
import { AnimatePresence } from 'framer-motion';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import * as Modal from 'components/Common/Modal';
import { ReactComponent as FieldIll } from 'assets/images/undraw_form.svg';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { FormNodeFieldFragment, FormNodePreview, TempFieldType } from './FormNodeForm';

interface StepFormNodeFormProps {
  position: number;
  onSubmit: (subForm: any) => void;
  step: any;
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

export const StepFormNodeFormFragment = ({ onSubmit, position, step }: StepFormNodeFormProps) => {
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

  console.log('Form node fields: ', formNodeFields);

  return (
    <UI.Card padding="1em" zIndex={299} ref={ref}>
      <UI.InputHeader>
        Step
        {' '}
        {position}
      </UI.InputHeader>
      <UI.Grid gridTemplateColumns="1fr 1fr">
        <UI.FormControl>
          <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
          <UI.InputHelper>{t('cta:title_helper')}</UI.InputHelper>
          <UI.Input {...form.register(`formNode.steps.${position}.header`)} placeholder={t('form_helpertext_placeholder')} />
        </UI.FormControl>
        <UI.FormControl>
          <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
          <UI.InputHelper>{t('cta:title_helper')}</UI.InputHelper>
          <UI.Input {...form.register(`formNode.steps.${position}.helper`)} placeholder={t('form_helpertext_placeholder')} />
        </UI.FormControl>
        <UI.FormControl>
          <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
          <UI.InputHelper>{t('cta:title_helper')}</UI.InputHelper>
          <UI.Input {...form.register(`formNode.steps.${position}.subHelper`)} placeholder={t('form_helpertext_placeholder')} />
        </UI.FormControl>
      </UI.Grid>

      <UI.Grid gridTemplateColumns="1fr 1fr">
        {fields?.map((field, index) => (
          <UI.Div position="relative" key={field.fieldIndex}>
            <AnimatePresence>
              <Modal.Root
                open={openedField === index}
                onClose={() => setOpenedField(null)}
                style={{ maxWidth: 1000 }}
              >
                <FormNodeFieldFragment
                  onSubmit={(subForm: any) => {
                    form.setValue(
                      `formNode.steps.${position}.fields.${index}`,
                      {
                        ...subForm,
                        contact: {
                          contacts: subForm.contact?.contacts
                            ? [...subForm.contact.contacts]
                            : [],
                        },
                      },
                      { shouldValidate: true, shouldDirty: true },
                    );
                    form.trigger();
                  }}
                  form={form}
                  onClose={() => setOpenedField(null)}
                  onDelete={() => remove(index)}
                  field={formNodeFields[index]} // formNodeFields[index]
                  fieldIndex={index}
                  key={field.fieldIndex}
                />
              </Modal.Root>
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
          </UI.IllustrationCard>
        ) : (
          <UI.Button mt={4} type="button" onClick={() => handleNewField()}>{t('add_field')}</UI.Button>
        )
      }
    </UI.Card>
  );
};
