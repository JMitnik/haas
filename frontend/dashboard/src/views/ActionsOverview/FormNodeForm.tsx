import * as UI from '@haas/ui';
import { AnimatePresence } from 'framer-motion';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { PlusCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Modal from 'components/Common/Modal';
import { ReactComponent as FieldIll } from 'assets/images/undraw_form.svg';

// eslint-disable-next-line import/no-cycle
import { FormStepPreview } from './FormStepPreview';
import { PreFormNodeFormFragment } from './PreFormNodeFragment';
import { PreNodeFormCell } from './PreNodeFormCell';
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
  const [openPreFormModal, setOpenPreFormModal] = useState(false);

  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: 'formNode.steps',
    keyName: 'fieldIndex',
  });

  const handleNewField = () => {
    append(appendNewField(fields.length + 1));
  };

  const stepsFields = form.watch('formNode.steps');
  const preFormNode = form.watch('formNode.preFormNode');

  return (
    <UI.FormSection id="form-node-form">
      <UI.Div>
        <UI.FormSectionHeader>{t('form_node')}</UI.FormSectionHeader>
        <UI.FormSectionHelper>{t('form_node_helper')}</UI.FormSectionHelper>
      </UI.Div>
      <UI.Div>
        <UI.Div>
          <UI.InputGrid>
            <UI.Div
              width="100%"
              backgroundColor="#fbfcff"
              border="1px solid #edf2f7"
              borderRadius="10px"
              padding={4}
            >
              <>
                <UI.Grid gridTemplateColumns="2fr 1fr">
                  <UI.Helper>{t('pre_node_form')}</UI.Helper>
                </UI.Grid>

                <UI.Grid
                  pt={2}
                  pb={2}
                  pl={0}
                  pr={0}
                  borderBottom="1px solid #edf2f7"
                  gridTemplateColumns="1fr"
                >
                  <UI.Div alignItems="center" display="flex">
                    <Controller
                      name="formNode.preFormNode"
                      control={form.control}
                      defaultValue={undefined}
                      render={({ field }) => (
                        <UI.Div
                          width="100%"
                        >
                          {field.value ? (
                            <PreNodeFormCell
                              onClick={() => setOpenPreFormModal(true)}
                              onRemove={() => form.setValue('formNode.preFormNode', null)}
                              node={field.value}
                            />
                          ) : (
                            <UI.Button
                              size="sm"
                              variant="outline"
                              onClick={() => setOpenPreFormModal(true)}
                              variantColor="altGray"
                            >
                              <UI.Icon mr={1}>
                                <PlusCircle />
                              </UI.Icon>
                              {t('add_pre_form_node')}
                            </UI.Button>
                          )}
                        </UI.Div>

                      )}
                    />
                    <AnimatePresence>
                      <Modal.Root
                        open={openPreFormModal}
                        onClose={() => setOpenPreFormModal(false)}
                        style={{ maxWidth: 1000 }}
                      >
                        <PreFormNodeFormFragment
                          preFormNode={preFormNode}
                          onSubmit={(subForm: any) => form.setValue('formNode.preFormNode', subForm)}
                          onClose={() => setOpenPreFormModal(false)}
                        />
                      </Modal.Root>
                    </AnimatePresence>
                  </UI.Div>
                </UI.Grid>
              </>
            </UI.Div>
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
