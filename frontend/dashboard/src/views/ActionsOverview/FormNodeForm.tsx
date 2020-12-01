import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import { AlertCircle, AtSign, Circle, FileText, Hash, Link2, Phone, Type } from 'react-feather';
import { Button } from '@chakra-ui/core';
import { Controller, UseFormMethods, useFieldArray, useWatch } from 'react-hook-form';

import { CTANodeFormProps, FormDataProps } from './CTATypes';
import useOnClickOutside from 'hooks/useClickOnOutside';

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

const FormNodePreview = ({ form, fieldIndex }: { form: UseFormMethods<FormDataProps>, fieldIndex: number }) => {
  const fieldName = 'formNode.fields';

  const formType = useWatch({
    name: `${fieldName}`,
    control: form.control,
  });

  useEffect(() => {
    console.log({ fieldName });
    console.log({ formType });
    console.log(form.getValues());
  });

  return (
    <UI.Card>
      <UI.CardBody>
        {formType?.type}
      </UI.CardBody>
    </UI.Card>
  );
};

const FormNodeFieldFragment = ({ form, field, fieldIndex, onClose }: { form: UseFormMethods<FormDataProps>, field: any, fieldIndex: number, onClose: () => void }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const fieldName = `formNode.fields[${fieldIndex}]`;

  // const formType = useWatch({
  //   name: `${fieldName}.type`,
  //   control: form.control,
  //   defaultValue: field.type,
  // });

  const formType = form.watch(`${fieldName}.type`, field.type);
  const formLabel = form.watch(`${fieldName}.label`, field.label);

  useEffect(() => {
    console.log({ fieldName });
    console.log({ formType });
    console.log({ formLabel });
    console.log(form.getValues());
  });

  useOnClickOutside(ref, onClose);

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
                onClick={() => form.setValue(`${fieldName}.type`, fieldCategory.type)}
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
              <UI.Input ref={form.control.register} name={`${fieldName}.label`} key={field.fieldIndex} />
            </UI.FormControl>
            <UI.FormControl>
              <UI.FormLabel>{t('is_required')}</UI.FormLabel>
              <Controller
                control={form.control}
                name={`${fieldName}.isRequired`}
                defaultValue={field.isRequired}
                render={(controlProps) => (
                  <UI.RadioButtons {...controlProps}>
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

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'formNode.fields',
    keyName: 'fieldIndex',
  });

  const handleNewField = () => {
    append(appendNewField(fields.length + 1));
  };

  useEffect(() => {
    console.log(form.getValues());
  }, [openedField, form]);

  return (
    <UI.FormSection id="form-node-form">
      <UI.Div>
        <UI.FormSectionHeader>{t('form_node')}</UI.FormSectionHeader>
      </UI.Div>
      <UI.Div>
        <UI.InputGrid>
          <UI.Div>
            <UI.FormLabel htmlFor="fields">{t('fields')}</UI.FormLabel>
            <Button type="button" onClick={() => handleNewField()}>{t('add_field')}</Button>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              {fields.map((field, index) => (
                <React.Fragment key={field.fieldIndex}>
                  {openedField === index ? (
                    <FormNodeFieldFragment
                      onClose={() => setOpenedField(null)}
                      form={form}
                      field={field}
                      fieldIndex={index}
                      key={field.fieldIndex}
                    />
                  ) : (
                    <UI.Card onClick={() => setOpenedField(index)}>
                      <FormNodePreview
                        form={form}
                        fieldIndex={index}
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
