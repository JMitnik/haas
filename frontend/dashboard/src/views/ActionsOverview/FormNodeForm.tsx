import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { AlertCircle, Circle, Star } from 'react-feather';
import { Button } from '@chakra-ui/core';
import { CTANodeFormProps } from './CTATypes';
import { Controller, useFieldArray } from 'react-hook-form';

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

interface TempFieldProps {
  label: string;
  position: number;
  type: TempFieldType;
  isRequired: number;
}

const makeDefaultField = (index: number): TempFieldProps => ({
  label: '',
  position: index,
  type: TempFieldType.SHORT_TEXT,
  isRequired: 0,
});

const FormNodeForm = ({ form }: FormNodeFormProps) => {
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields',
    keyName: 'fieldIndex',
  });

  const handleNewField = () => {
    append(makeDefaultField(fields.length + 1));
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
              <>
                <UI.Card noHover bg="gray.200">
                  <UI.CardBody>
                    <UI.FormControl>
                      <UI.FormLabel>{t('label')}</UI.FormLabel>
                      <UI.Input name={`{fields[${index}]}.label`} />
                    </UI.FormControl>
                    <UI.FormControl>
                      <UI.FormLabel>{t('is_required')}</UI.FormLabel>
                      <Controller
                        control={form.control}
                        name={`{fields[${index}]}.isRequired`}
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
                    <UI.FormControl>
                      <UI.FormLabel>{t('form_type')}</UI.FormLabel>
                      <Controller
                        control={form.control}
                        name={`{fields[${index}]}.type`}
                        render={(controlProps) => (
                          <UI.RadioButtons {...controlProps}>
                            <UI.RadioButton
                              value={TempFieldType.EMAIL}
                              text="Email"
                            />
                            <UI.RadioButton
                              value={TempFieldType.SHORT_TEXT}
                              text="Short text"
                            />
                            <UI.RadioButton
                              value={TempFieldType.LONG_TEXT}
                              text="Long text"
                            />
                            <UI.RadioButton
                              value={TempFieldType.NUMBER}
                              text="Number"
                            />
                            <UI.RadioButton
                              value={TempFieldType.PHONE_NUMBER}
                              text="Phone number"
                            />
                          </UI.RadioButtons>
                        )}
                      />
                    </UI.FormControl>
                    test
                  </UI.CardBody>
                </UI.Card>
              </>
            ))}
          </UI.Div>
        </UI.InputGrid>
      </UI.Div>
    </UI.FormSection>
  );
};

export default FormNodeForm;
