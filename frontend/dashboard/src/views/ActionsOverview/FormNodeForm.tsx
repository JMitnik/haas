import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { AlertCircle, Circle, Type } from 'react-feather';
import { Button } from '@chakra-ui/core';
import { Controller, UseFormMethods, useFieldArray, useWatch } from 'react-hook-form';

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
  icon: React.ReactNode;
  constraints: {
    allowsRequired: boolean;
  }
}

const fieldMap: FieldProps[] = [
  {
    type: TempFieldType.EMAIL,
    icon: Type,
    color: '#3badff',
    constraints: {
      allowsRequired: true,
    },
  },
];

const FormNodeFieldFragment = ({ form, field, fieldIndex }: { form: UseFormMethods<FormDataProps>, field: any, fieldIndex: number }) => {
  const { t } = useTranslation();

  const fieldName = `form.fields[${fieldIndex}]`;

  const formType = useWatch({
    control: form.control,
    defaultValue: '',
  });

  const { register } = form;
  useEffect(() => {
    register(`${fieldName}.type`);
  }, [register, fieldName]);

  return (
    <UI.Card noHover>
      <UI.CardForm dualPane>
        <UI.List>
          <UI.ListGroupHeader>{t('fields')}</UI.ListGroupHeader>
          <UI.ListGroup>
            {fieldMap.map((fieldCategory) => (
              <UI.ListItem onClick={() => form.setValue(`${fieldName}.type`, fieldCategory.type)}>
                <UI.ListIcon bg={fieldCategory.color}><Type /></UI.ListIcon>
                <UI.ListItemBody>
                  <UI.Text>{t(fieldCategory.type)}</UI.Text>
                  <UI.Text>{t(`${fieldCategory.type}_helper`)}</UI.Text>
                </UI.ListItemBody>
              </UI.ListItem>
            ))}
          </UI.ListGroup>
        </UI.List>
        {formType ? (
          <UI.CardBody>
            <UI.FormControl>
              <UI.FormLabel>{t('label')}</UI.FormLabel>
              <UI.Input defaultValue="label" ref={form.register()} name={`${fieldName}.label`} />
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
  label: string;
  position: number;
  type: TempFieldType | null;
  isRequired: number;
}

const appendNewField = (index: number): TempFieldProps => ({
  label: '',
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
            {fields.map((field, index) => (
              <React.Fragment key={index}>
                {openedField === index ? (
                  <FormNodeFieldFragment
                    form={form}
                    field={field}
                    fieldIndex={index}
                    key={field.fieldIndex}
                  />
                ) : (
                  <UI.Card onClick={() => setOpenedField(index)}>Open</UI.Card>
                )}
              </React.Fragment>
            ))}
          </UI.Div>
        </UI.InputGrid>
      </UI.Div>
    </UI.FormSection>
  );
};

export default FormNodeForm;
