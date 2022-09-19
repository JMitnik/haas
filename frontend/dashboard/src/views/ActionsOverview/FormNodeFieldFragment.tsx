import * as UI from '@haas/ui';
import { AlertCircle, Circle } from 'react-feather';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { IllustrationCard } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';

import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { TempFieldType, fieldMap } from './FormNodeForm.types';
import FormNodeContactsFragment from './FormNodeContactFragment';

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
                <UI.Input id="label" {...form.register(`formNode.steps.${stepIndex}.fields.${fieldIndex}.label`)} />
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
