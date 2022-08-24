import * as UI from '@haas/ui';
import { ArrowDown, ArrowUp, Feather, Trash, Users } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { TempFieldType } from './FormNodeForm.types';

interface FormStepPreviewProps {
  field: any;
  onMoveRight: any;
  onMoveLeft: any;
  onOpen: any;
  fieldIndex: number;
  nrFields: number;
  onDelete: () => void;
}

export const FormStepPreview = (
  { field, onMoveRight, onMoveLeft, onOpen, fieldIndex, nrFields, onDelete }: FormStepPreviewProps,
) => {
  const fieldCategory = {
    type: TempFieldType.GENERIC_FIELDS,
    icon: Users,
    color: '#7274f4',
    constraints: {
      allowsRequired: false,
    },
  };

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
                <UI.Text color="gray.500" fontWeight="700">{field?.header ? `Page ${fieldIndex + 1}: ${field?.header} ` : `Page ${fieldIndex + 1}: Unnamed page`}</UI.Text>
                <UI.Text fontWeight="300" color="gray.500">
                  {field?.fields?.length || 0}
                  {' '}
                  field(s)
                </UI.Text>
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
              aria-label="Move step up"
              icon={() => <ArrowUp />}
              type="button"
              isDisabled={fieldIndex === 0}
              onClick={(event) => {
                event.stopPropagation();
                onMoveLeft();
              }}
            />
            <UI.Button size="sm" type="button" onClick={onOpen}>
              {t('edit_step')}
            </UI.Button>
            <UI.IconButton
              size="sm"
              aria-label="Move step down"
              icon={() => <ArrowDown />}
              type="button"
              isDisabled={fieldIndex === nrFields - 1}
              onClick={(event) => {
                event.stopPropagation();
                onMoveRight();
              }}
            />
            <UI.IconButton
              size="sm"
              aria-label="Delete step"
              icon={() => <Trash />}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            />
          </UI.ButtonGroup>
        </UI.Flex>
      </UI.CardBody>
    </UI.Card>
  );
};
