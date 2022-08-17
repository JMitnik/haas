import * as UI from '@haas/ui';
import { ArrowLeft, ArrowRight, Feather } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { fieldMap } from './FormNodeForm.types';

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
