import * as UI from '@haas/ui';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Circle,
  Feather,
  FileText,
  Hash,
  Link2,
  Phone,
  Type,
  Users,
} from 'react-feather';
import { AnimatePresence } from 'framer-motion';
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
import { IllustrationCard } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import * as Modal from 'components/Common/Modal';
import { ReactComponent as FieldIll } from 'assets/images/undraw_form.svg';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { FormStepPreview } from './FormStepPreview';
import { StepFormNodeFormFragment } from './StepNodeFormFragment';
import FormNodeContactsFragment from './FormNodeContactFragment';

// TODO: Remove and place this in API or so
export enum TempFieldType {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  URL = 'url',
  SHORT_TEXT = 'shortText',
  LONG_TEXT = 'longText',
  NUMBER = 'number',
  CONTACTS = 'contacts',
  GENERIC_FIELDS = 'GENERIC_FIELDS',
}

interface FieldProps {
  type: TempFieldType;
  color: string;
  icon: any;
  constraints: {
    allowsRequired: boolean;
  }
}

const fieldMap: FieldProps[] = [
  {
    type: TempFieldType.EMAIL,
    icon: AtSign,
    color: '#f59e0b',
    constraints: {
      allowsRequired: true,
    },
  },
  {
    type: TempFieldType.PHONE_NUMBER,
    icon: Phone,
    color: '#fbbf24',
    constraints: {
      allowsRequired: true,
    },
  },
  {
    type: TempFieldType.URL,
    icon: Link2,
    color: '#DB2777',
    constraints: {
      allowsRequired: true,
    },
  },
  {
    type: TempFieldType.SHORT_TEXT,
    icon: Type,
    color: '#ef4444',
    constraints: {
      allowsRequired: true,
    },
  },
  {
    type: TempFieldType.LONG_TEXT,
    icon: FileText,
    color: '#ec4899',
    constraints: {
      allowsRequired: true,
    },
  },
  {
    type: TempFieldType.NUMBER,
    icon: Hash,
    color: '#f472b6',
    constraints: {
      allowsRequired: true,
    },
  },
  {
    type: TempFieldType.CONTACTS,
    icon: Users,
    color: '#7274f4',
    constraints: {
      allowsRequired: false,
    },
  },
];

interface FormNodePreviewProps {
  field: any;
  onMoveRight: any;
  onMoveLeft: any;
  onOpen: any;
  fieldIndex: number;
  nrFields: number;
}

export const FormNodePreview = (
  { field, onMoveRight, onMoveLeft, onOpen, fieldIndex, nrFields }: FormNodePreviewProps,
) => {
  const fieldCategory = fieldMap.find((fieldItem) => fieldItem?.type === field?.type);

  const FieldIcon = fieldCategory?.icon || Feather;
  const { t } = useTranslation();

  return (
    <UI.Card>
      <UI.CardBody>
        <UI.Flex flexWrap="wrap" justifyContent="space-between">
          {field?.type ? (
            <UI.Flex mb={[4, 0]}>
              <UI.IconBox mr={2} bg={fieldCategory?.color}><FieldIcon /></UI.IconBox>
              <UI.ColumnFlex>
                <UI.Text color="gray.500" fontWeight="700">{field?.label || 'Unnamed field'}</UI.Text>
                <UI.Text fontWeight="300" color="gray.500">{t(`${field?.type}_type`)}</UI.Text>
              </UI.ColumnFlex>
            </UI.Flex>
          ) : (
            <UI.ColumnFlex>
              <UI.Text>{t('empty_field')}</UI.Text>
              <UI.InputHelper>{t('empty_field_helper')}</UI.InputHelper>
            </UI.ColumnFlex>
          )}
          <UI.ButtonGroup display="flex">
            <UI.IconButton
              size="sm"
              aria-label="Move field left"
              icon={() => <ArrowLeft />}
              type="button"
              isDisabled={fieldIndex === 0}
              onClick={(event) => {
                event.stopPropagation();
                onMoveLeft();
              }}
            />
            <UI.Button size="sm" type="button" onClick={onOpen}>
              {t('edit_field')}
            </UI.Button>
            <UI.IconButton
              size="sm"
              aria-label="Move field right"
              icon={() => <ArrowRight />}
              type="button"
              isDisabled={fieldIndex === nrFields - 1}
              onClick={(event) => {
                event.stopPropagation();
                onMoveRight();
              }}
            />
          </UI.ButtonGroup>
        </UI.Flex>
      </UI.CardBody>
    </UI.Card>
  );
};

interface FormNodeFieldFragmentProps {
  field: any;
  fieldIndex: number;
  stepIndex: number;
  onClose: () => void;
  onSubmit?: (values: any) => void;
  onDelete: () => void;
}

export const FormNodeFieldFragment = (
  { field, onClose, onDelete, stepIndex, fieldIndex }: FormNodeFieldFragmentProps,
) => {
  const form = useFormContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const formType = form.watch(`formNode.steps.${stepIndex}.fields.${fieldIndex}.type`);

  const handleSaveValues = () => {
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  useOnClickOutside(ref, () => {
    handleSaveValues();
  });

  const contacts = useWatch({
    name: `formNode.steps.${stepIndex}.fields.${fieldIndex}.contact.contacts`,
    control: form.control,
  });

  console.log('Contacts: ', contacts);

  useEffect(() => {
    const component = ref.current;

    return () => {
      console.log('Unmounted');
      onClose();
    };
  }, []);

  return (
    <UI.Card zIndex={300} ref={ref}>
      <UI.CardForm dualPane>
        <UI.List>
          <UI.ListGroupHeader>{t('select_a_field_type')}</UI.ListGroupHeader>
          <UI.ListGroup>
            {fieldMap.map((fieldCategory, index) => (
              <UI.ListItem
                key={index}
                accent={fieldCategory.color}
                isSelected={formType === fieldCategory.type}
                onClick={() => form.setValue(`formNode.steps.${stepIndex}.fields.${fieldIndex}.type`, fieldCategory.type)}
              >
                <UI.ListIcon bg={fieldCategory.color}><fieldCategory.icon /></UI.ListIcon>
                <UI.ListItemBody>
                  <UI.Text color="gray.500" fontWeight={700}>{t(fieldCategory.type)}</UI.Text>
                  <UI.Text color="gray.400">{t(`${fieldCategory.type}_helper`)}</UI.Text>
                </UI.ListItemBody>
                <UI.ListItemCaret />
              </UI.ListItem>
            ))}
          </UI.ListGroup>
        </UI.List>
        {formType ? (
          <UI.CardBody display="flex" flexDirection="column" justifyContent="space-between">
            <UI.InputGrid>
              <UI.FormControl>
                <UI.FormLabel htmlFor="label">{t('label')}</UI.FormLabel>
                <UI.Input {...form.register(`formNode.steps.${stepIndex}.fields.${fieldIndex}.label`)} />
              </UI.FormControl>
              <UI.FormControl>
                <UI.FormLabel htmlFor="placeholder">{t('placeholder')}</UI.FormLabel>
                <UI.Input {...form.register(`formNode.steps.${stepIndex}.fields.${fieldIndex}.placeholder`)} />
              </UI.FormControl>
              <UI.FormControl>
                <UI.FormLabel htmlFor="isRequired">{t('is_required')}</UI.FormLabel>
                <Controller
                  control={form.control}
                  name={`formNode.steps.${stepIndex}.fields.${fieldIndex}.isRequired`}
                  defaultValue={field?.isRequired}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                      <UI.RadioButton
                        icon={AlertCircle}
                        value={1}
                        mr={2}
                        text={(t('required'))}
                        description={t('required_helper')}
                      />
                      <UI.RadioButton
                        icon={Circle}
                        value={0}
                        mr={2}
                        text={(t('not_required'))}
                        description={t('not_required_helper')}
                      />
                    </UI.RadioButtons>
                  )}
                />
              </UI.FormControl>

              {formType === TempFieldType.CONTACTS && (
                <FormNodeContactsFragment
                  stepIndex={stepIndex}
                  fieldIndex={fieldIndex}
                  contacts={contacts}
                />
              )}
            </UI.InputGrid>
            <UI.ButtonGroup justifySelf="flex-end" display="flex">
              <UI.Button onClick={handleSaveValues} variantColor="teal">{t('finish_editing')}</UI.Button>
              <UI.Button onClick={handleDelete} variantColor="red" variant="outline">{t('delete_field')}</UI.Button>
            </UI.ButtonGroup>
          </UI.CardBody>
        ) : (
          <UI.CardBody>
            <IllustrationCard text={t('select_a_field_type')} svg={<SelectIll />}>
              <UI.Text fontWeight={200} pb={2}>or</UI.Text>
              <UI.ButtonGroup justifySelf="flex-end">
                <UI.Button
                  size="sm"
                  onClick={handleDelete}
                  variantColor="red"
                  variant="outline"
                >
                  {t('delete_field')}

                </UI.Button>
              </UI.ButtonGroup>
            </IllustrationCard>
          </UI.CardBody>
        )}
      </UI.CardForm>
    </UI.Card>
  );
};

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
              <UI.IllustrationCard svg={<FieldIll />} text={t('add_field_reminder')}>
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
