import * as UI from '@haas/ui';
import { AlertCircle, ArrowLeft, ArrowRight, AtSign, Circle, Edit2, Feather, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import { Button } from '@chakra-ui/core';
import { Controller, UseFormMethods, useFieldArray, useForm } from 'react-hook-form';
import { usePopper } from 'react-popper';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import { ReactComponent as FieldIll } from 'assets/images/undraw_form.svg';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { AnimatePresence, AnimateSharedLayout, Variants, motion } from 'framer-motion';
import { CTANodeFormProps, FormDataProps } from './CTATypes';
import Dropdown from 'components/Dropdown';

type FormNodeFormProps = CTANodeFormProps;

// TODO: Remove and place this in API or so
enum TempFieldType {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  URL = 'url',
  SHORT_TEXT = 'shortText',
  LONG_TEXT = 'longText',
  NUMBER = 'number',
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
];

interface FormNodePreviewProps {
  form: UseFormMethods<FormDataProps>;
  field: any;
  onMoveRight: any;
  onMoveLeft: any;
  onOpen: any;
  fieldIndex: number;
  nrFields: number;
}

const MotionCard = motion.custom(UI.Card);
const MotionButton = motion.custom(UI.Button);

const FormNodePreview = ({ form, field, onMoveRight, onMoveLeft, onOpen, fieldIndex, nrFields }: FormNodePreviewProps) => {
  const fieldCategory = fieldMap.find((fieldItem) => fieldItem.type === field.type);

  const FieldIcon = fieldCategory?.icon || Feather;
  const { t } = useTranslation();

  return (
    <UI.Card>
      <UI.CardBody>
        <UI.Flex flexWrap="wrap" justifyContent="space-between">
          {field.type ? (
            <UI.Flex mb={[4, 0]}>
              <UI.IconBox mr={2} bg={fieldCategory?.color}><FieldIcon /></UI.IconBox>
              <UI.ColumnFlex>
                <UI.Text color="gray.500" fontWeight="700">{field?.label || 'Unnamed field'}</UI.Text>
                <UI.Text fontWeight="300" color="gray.500">{t(`${field?.type}_type`)}</UI.Text>
              </UI.ColumnFlex>
            </UI.Flex>
          ) : (
            <UI.Text>{t('empty_field')}</UI.Text>
          )}
          <UI.ButtonGroup>
            <UI.IconButton
              size="sm"
              aria-label="Move field left"
              icon={ArrowLeft}
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
              icon={ArrowRight}
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

const parentPopup: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const childPopUp: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 100,
  },
};

const FormNodeFieldFragment = ({ field, onClose, onSubmit, fieldIndex }: { field: any, fieldIndex: number, onClose: () => void, onSubmit: any }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const subform = useForm({
    mode: 'all',
    shouldUnregister: false,
    defaultValues: field,
  });

  const formType = subform.watch('type');

  useOnClickOutside(ref, () => {
    onSubmit(subform.getValues());
    onClose();
  });

  return (
    <motion.div style={{ zIndex: 300 }} variants={parentPopup} initial="initial" animate="animate" exit="exit">
      <motion.div variants={childPopUp}>
        <UI.Card bg="white" zIndex={300} noHover ref={ref}>
          <UI.CardForm dualPane>
            <UI.List>
              <UI.ListGroupHeader>{t('select_a_field_type')}</UI.ListGroupHeader>
              <UI.ListGroup>
                {fieldMap.map((fieldCategory, index) => (
                  <UI.ListItem
                    key={index}
                    accent={fieldCategory.color}
                    isSelected={formType === fieldCategory.type}
                    onClick={() => subform.setValue('type', fieldCategory.type)}
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
              <UI.CardBody>
                <UI.InputGrid>
                  <UI.FormControl>
                    <UI.FormLabel htmlFor="label">{t('label')}</UI.FormLabel>
                    <UI.Input ref={subform.register()} name="label" key={field.fieldIndex} />
                  </UI.FormControl>
                  <UI.FormControl>
                    <UI.FormLabel htmlFor="isRequired">{t('is_required')}</UI.FormLabel>
                    <Controller
                      control={subform.control}
                      name="isRequired"
                      defaultValue={field.isRequired}
                      render={({ onBlur, onChange, value }) => (
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
                </UI.InputGrid>
              </UI.CardBody>
            ) : (
              <UI.CardBody>
                {t('select_your_type')}
              </UI.CardBody>
            )}
          </UI.CardForm>
        </UI.Card>
      </motion.div>
    </motion.div>
  );
};

interface TempFieldProps {
  label: string | null;
  position: number;
  type: TempFieldType | null;
  isRequired: number;
}

const appendNewField = (index: number): TempFieldProps => ({
  label: null,
  position: index,
  type: null,
  isRequired: 0,
});

const FormNodeForm = ({ form }: FormNodeFormProps) => {
  const { t } = useTranslation();
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const [toggleRef, setToggleRef] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(toggleRef, overlay, {
    placement: 'left-end',
  });

  const [openedField, setOpenedField] = useState<number | null>(null);

  const { fields, append, move } = useFieldArray({
    control: form.control,
    name: 'formNode.fields',
    keyName: 'fieldIndex',
  });

  const handleNewField = () => {
    append(appendNewField(fields.length + 1));
  };

  const formNodeFields = form.watch('formNode.fields', []);

  return (
    <UI.FormSection id="form-node-form">
      <UI.Div>
        <UI.FormSectionHeader>{t('form_node')}</UI.FormSectionHeader>
        <UI.FormSectionHelper>{t('form_node_helper')}</UI.FormSectionHelper>
      </UI.Div>
      <UI.Div>
        <UI.InputGrid>
          <UI.Div pb="300px">
            {fields.length === 0 ? (
              <UI.IllustrationCard svg={<FieldIll />} text={t('add_field_reminder')}>
                <Button type="button" onClick={() => handleNewField()}>{t('add_field')}</Button>
              </UI.IllustrationCard>
            ) : (
              <Button type="button" onClick={() => handleNewField()}>{t('add_field')}</Button>
            )}
            <UI.Grid gridTemplateColumns="1fr 1fr">
              {fields.map((field, index) => (
                <UI.Div ref={setToggleRef}>
                  <UI.Div position="relative" key={field.fieldIndex}>
                    <AnimatePresence>
                      {openedField === index && (
                        // <UI.Div
                        //   ref={setOverlay}
                        //   position="absolute"
                        //   top="0"
                        //   zIndex={500}
                        //   style={styles.popper}
                        //   {...attributes.popper}
                        // >
                        <UI.Modal isOpen={openedField === index} onClose={() => setOpenedField(null)}>
                          <FormNodeFieldFragment
                            onSubmit={(subForm: any) => {
                              form.setValue(`formNode.fields[${index}]`, subForm, { shouldDirty: true, shouldValidate: true });
                              form.trigger();
                            }}
                            onClose={() => setOpenedField(null)}
                            field={formNodeFields[index]}
                            fieldIndex={index}
                            key={field.fieldIndex}
                          />
                        </UI.Modal>
                        // </UI.Div>
                      )}
                    </AnimatePresence>

                    <FormNodePreview
                      fieldIndex={index}
                      nrFields={fields.length}
                      field={formNodeFields[index]}
                      form={form}
                      onOpen={() => setOpenedField(index)}
                      onMoveLeft={() => move(index, Math.max(index - 1, 0))}
                      onMoveRight={() => {
                        move(index, Math.min(index + 1, fields.length - 1));
                      }}
                    />
                  </UI.Div>
                </UI.Div>
              ))}
            </UI.Grid>
          </UI.Div>
        </UI.InputGrid>
      </UI.Div>
    </UI.FormSection>
  );
};

export default FormNodeForm;
