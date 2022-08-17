import * as UI from '@haas/ui';
import { AnimatePresence } from 'framer-motion';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Modal from 'components/Common/Modal';
import { ReactComponent as FieldIll } from 'assets/images/undraw_form.svg';

import { FormStepPreview } from './FormStepPreview';
// eslint-disable-next-line import/no-cycle
import { StepFormNodeFormFragment } from './StepNodeFormFragment';
import { TempFieldType } from './FormNodeForm.types';

interface TempStepProps {
  position: number;
  header: string;
  fields: any[];
  type: TempFieldType;
}

const appendNewField = (index: number): TempStepProps => ({
  position: index,
  type: TempFieldType.GENERIC_FIELDS,
  header: '',
  fields: [],
});

const FormNodeForm = () => {
  const form = useFormContext();
  const { t } = useTranslation();
  const [openedStep, setOpenedStep] = useState<number | null>(null);

  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: 'formNode.steps',
    keyName: 'fieldIndex',
  });

  const handleNewField = () => {
    append(appendNewField(fields.length + 1));
  };

  const stepsFields = form.watch('formNode.steps');

  return (
    <UI.FormSection id="form-node-form">
      <UI.Div>
        <UI.FormSectionHeader>{t('form_node')}</UI.FormSectionHeader>
        <UI.FormSectionHelper>{t('form_node_helper')}</UI.FormSectionHelper>
      </UI.Div>
      <UI.Div>
        <UI.Div>
          <UI.InputGrid>
            {fields?.map((field, index) => (
              <UI.Div position="relative" key={field.fieldIndex}>
                <AnimatePresence>
                  <Modal.Root
                    open={openedStep === index}
                    onClose={() => setOpenedStep(null)}
                    style={{ maxWidth: 1000 }}
                  >
                    <StepFormNodeFormFragment
                      key={field.fieldIndex}
                      position={index}
                      onClose={() => setOpenedStep(null)}
                      onDelete={() => {
                        setOpenedStep(null);
                        remove(index);
                      }}
                    />
                  </Modal.Root>
                </AnimatePresence>

                <FormStepPreview
                  fieldIndex={index}
                  nrFields={fields.length}
                  field={stepsFields[index]}
                  onOpen={() => setOpenedStep(index)}
                  onMoveLeft={() => move(index, Math.max(index - 1, 0))}
                  onMoveRight={() => {
                    move(index, Math.min(index + 1, fields.length - 1));
                  }}
                  onDelete={() => remove(index)}
                />

              </UI.Div>

            ))}
            {fields?.length === 0 ? (
              <UI.IllustrationCard svg={<FieldIll />} text={t('add_step_reminder')}>
                <UI.Button type="button" onClick={() => handleNewField()}>{t('add_step')}</UI.Button>
              </UI.IllustrationCard>
            ) : (
              <UI.Button mt={4} type="button" onClick={() => handleNewField()}>{t('add_step')}</UI.Button>
            )}
          </UI.InputGrid>
        </UI.Div>
      </UI.Div>
    </UI.FormSection>
  );
};

export default FormNodeForm;
