import * as UI from '@haas/ui';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, AtSign, Feather, FileText, Hash, Link2, Phone, Trash, Type, Users } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

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

interface FormStepPreviewProps {
  field: any;
  onMoveRight: any;
  onMoveLeft: any;
  onOpen: any;
  fieldIndex: number;
  nrFields: number;
  onDelete: () => void;
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
  {
    type: TempFieldType.GENERIC_FIELDS,
    icon: Users,
    color: '#7274f4',
    constraints: {
      allowsRequired: false,
    },
  },
];

export const FormStepPreview = (
  { field, onMoveRight, onMoveLeft, onOpen, fieldIndex, nrFields, onDelete }: FormStepPreviewProps,
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
              aria-label="Move field left"
              icon={() => <ArrowUp />}
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
