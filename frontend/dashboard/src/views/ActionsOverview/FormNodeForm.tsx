import * as UI from '@haas/ui';
import { AlertCircle, AtSign, Circle, Feather, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import { Button } from '@chakra-ui/core';
import { Controller, UseFormMethods, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import useOnClickOutside from 'hooks/useClickOnOutside';

import { CTANodeFormProps, FormDataProps } from './CTATypes';

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

const FormNodePreview = ({ form, field, onMoveRight, onMoveLeft }: { form: UseFormMethods<FormDataProps>, field: any, onMoveRight: any, onMoveLeft: any }) => {
  const fieldCategory = fieldMap.find((fieldItem) => fieldItem.type === field.type);

  const FieldIcon = fieldCategory?.icon || Feather;

  return (
    <UI.Card>
      <UI.CardBody>
        {field.type && (
          <UI.Flex>
            <UI.IconBox mr={2} bg={fieldCategory?.color}><FieldIcon /></UI.IconBox>
            <UI.ColumnFlex>
              <UI.Text color="gray.700" fontWeight="900">{field?.label || 'Generic field'}</UI.Text>
              <UI.Text fontWeight="300" color="gray.400">{field?.type}</UI.Text>
            </UI.ColumnFlex>
          </UI.Flex>
        )}
        <UI.Button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMoveLeft();
          }}
        >
          Left
        </UI.Button>
        <UI.Button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMoveRight();
          }}
        >
          Right
        </UI.Button>
      </UI.CardBody>
    </UI.Card>
  );
};

const FormNodeFieldFragment = ({ field, onClose, onSubmit }: { field: any, fieldIndex: number, onClose: () => void, onSubmit: any }) => {
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
    <UI.Card noHover ref={ref}>
      <UI.CardForm dualPane>
        <UI.List>
          <UI.ListGroupHeader>{t('field_types')}</UI.ListGroupHeader>
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
                  <UI.Text>{t(fieldCategory.type)}</UI.Text>
                  <UI.Text>{t(`${fieldCategory.type}_helper`)}</UI.Text>
                </UI.ListItemBody>
                <UI.ListItemCaret />
              </UI.ListItem>
            ))}
          </UI.ListGroup>
        </UI.List>
        {formType ? (
          <UI.CardBody>
            <UI.FormControl>
              <UI.FormLabel>{t('label')}</UI.FormLabel>
              <UI.Input ref={subform.register()} name="label" key={field.fieldIndex} />
            </UI.FormControl>
            <UI.FormControl>
              <UI.FormLabel>{t('is_required')}</UI.FormLabel>
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
          </UI.CardBody>
        ) : (
          <UI.CardBody>
            {t('select_your_type')}
          </UI.CardBody>
        )}
      </UI.CardForm>
    </UI.Card>
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
        <UI.FormSectionHelper>{t('form_node')}</UI.FormSectionHelper>
      </UI.Div>
      <UI.Div>
        <UI.InputGrid>
          <UI.Div>
            <Button type="button" onClick={() => handleNewField()}>{t('add_field')}</Button>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              {fields.map((field, index) => (
                <React.Fragment key={field.fieldIndex}>
                  {openedField === index ? (
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
                  ) : (
                    <UI.Card onClick={() => setOpenedField(index)}>
                      <FormNodePreview
                        field={formNodeFields[index]}
                        form={form}
                        onMoveLeft={() => move(index, Math.max(index - 1, 0))}
                        onMoveRight={() => {
                          move(index, Math.min(index + 1, fields.length - 1));
                        }}
                      />
                    </UI.Card>
                  )}
                </React.Fragment>
              ))}
            </UI.Grid>
          </UI.Div>
        </UI.InputGrid>
      </UI.Div>
    </UI.FormSection>
  );
};

export default FormNodeForm;
