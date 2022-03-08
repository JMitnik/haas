import * as UI from '@haas/ui';
import { Controller, FieldArrayMethodProps } from 'react-hook-form';
import { FormControl } from '@chakra-ui/core';
import { MoreVertical, PlusCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Select from 'react-select';

import { ConditionCell } from './ConditionCell';
import { ConditionEntry } from './CreateConditionModalCard';
import { ConditionNodePicker } from '../../components/NodePicker/ConditionNodePicker';
import { OPERATORS } from './AutomationTypes';
import Dropdown from '../../components/Dropdown';

interface ConditionBuilderEntryProps {
  form: any;
  conditionFields: Record<'arrayKey', string>[];
  append: (value: Partial<unknown> | Partial<unknown>[], options?: FieldArrayMethodProps | undefined) => void;
  remove: (index?: number | number[] | undefined) => void;
  openMenu: (event: React.MouseEvent<Element, MouseEvent>, selectedActiveItem?: any) => void;
  onAddCondition: React.Dispatch<React.SetStateAction<ConditionEntry[]>>;
  activeConditions: ConditionEntry[];
}

export const ChildBuilderEntry = ({
  append,
  conditionFields,
  form,
  openMenu,
  remove,
  onAddCondition,
  activeConditions,
}: ConditionBuilderEntryProps) => {
  const { t } = useTranslation();

  return (
    <UI.Div backgroundColor="#f5f8fa">
      <UI.Grid m={2} gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto">

        <UI.Helper>{t('automation:logic')}</UI.Helper>
        <UI.Helper>{t('automation:condition')}</UI.Helper>
        <UI.Helper>{t('automation:operator')}</UI.Helper>
        <UI.Helper>{t('automation:compare_to')}</UI.Helper>
      </UI.Grid>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {conditionFields.map((condition, index) => (
        <UI.Grid
          key={condition?.arrayKey}
          ml={2}
          mr={2}
          p={2}
          borderRadius="6px"
          borderBottom="1px solid #edf2f7"
          gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto"
          backgroundColor="#f5f8fa"
          position="relative"
        >
          <input defaultValue={1} type="hidden" {...form.register(`childBuilder.conditions.${index}.depth`)} />
          <UI.Div>
            {index !== 0 && (
              <Controller
                name="childBuilder.logical"
                control={form.control}
                render={({ field }) => (
                  <Select
                    options={[{ label: 'AND', value: 'AND' }, { label: 'OR', value: 'OR' }]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            )}

          </UI.Div>

          <UI.Div alignItems="center" display="flex">
            <Controller
              name={`childBuilder.conditions.${index}.condition`}
              control={form.control}
              defaultValue={(condition as any)?.condition}
              render={({ field: { value, onChange } }) => (
                <Dropdown
                  defaultCloseOnClickOutside={false}
                  renderOverlay={({ onClose, setCloseClickOnOutside }) => (
                    <ConditionNodePicker
                      onAddCondition={onAddCondition}
                      items={activeConditions}
                      onClose={onClose}
                      onChange={(data) => onChange(data)}
                      onModalOpen={() => setCloseClickOnOutside(false)}
                      onModalClose={() => setCloseClickOnOutside(true)}
                    />
                  )}
                >
                  {({ onOpen }) => (
                    <UI.Div
                      width="100%"
                      justifyContent="center"
                      display="flex"
                      alignItems="center"
                    >
                      {value ? (
                        <ConditionCell
                          onRemove={() => {
                            onChange(null);
                            // remove(index);
                          }}
                          onClick={onOpen}
                          condition={value}
                        />
                      ) : (
                        <UI.Button
                          size="sm"
                          variant="outline"
                          onClick={onOpen}
                          variantColor="altGray"
                        >
                          <UI.Icon mr={1}>
                            <PlusCircle />
                          </UI.Icon>
                          {t('automation:add_condition')}
                        </UI.Button>
                      )}
                    </UI.Div>
                  )}
                </Dropdown>
              )}
            />
          </UI.Div>
          <UI.Div>
            <Controller
              name={`childBuilder.conditions.${index}.operator`}
              defaultValue={(condition as any)?.operator}
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <Select options={OPERATORS} onChange={onChange} value={value} />
              )}
            />
          </UI.Div>
          <FormControl isRequired>
            <UI.Input
              {...form.register(`childBuilder.conditions.${index}.compareTo`, { required: true })}
            />
          </FormControl>
          <UI.Icon
            color="#808b9a"
            style={{ cursor: 'pointer' }}
            mr={1}
            onClick={(e) => openMenu(e, { ...condition, isGrouped: true })}
          >
            <MoreVertical />
          </UI.Icon>
        </UI.Grid>
      ))}
      <UI.Div ml={2} mt={4}>
        <UI.Button
          variantColor="gray"
          onClick={
            () => append({ depth: 0 })
          }
        >
          <UI.Icon mr={1}>
            <PlusCircle />
          </UI.Icon>
          {t('add_choice')}
        </UI.Button>
      </UI.Div>
    </UI.Div>
  );
};

export default ChildBuilderEntry;
