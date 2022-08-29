import * as UI from '@haas/ui';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Copy, MoreVertical, PlusCircle, Trash2 } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import Select from 'react-select';

import * as Menu from 'components/Common/Menu';
import * as Modal from 'components/Common/Modal';
import { ConditionNodePicker } from 'components/NodePicker/ConditionNodePicker';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { useMenu } from 'components/Common/Menu/useMenu';
import Dropdown from 'components/Dropdown';

import { Button } from '@chakra-ui/core';
import { ChildBuilderEntry } from './ChildBuilderEntry';
import { ConditionCell } from './ConditionCell';
import { ConditionEntry } from './CreateConditionModalCardTypes';
import { CreateConditionModalCard } from './CreateConditionModalCard';
import { DEPTH_BACKGROUND_COLORS } from './AutomationForm.constants';
import { ModalState, ModalType, OPERATORS } from './AutomationTypes';

interface TriggerAutomationFragmentProps {
  conditions?: ConditionEntry[]
}

export const TriggerAutomationFragment = ({ conditions }: TriggerAutomationFragmentProps) => {
  const form = useFormContext();
  const { t } = useTranslation();
  const { openMenu, closeMenu, menuProps, activeItem } = useMenu<any>();

  const [createModalIsOpen, setCreateModalIsOpen] = useState<ModalState>({ isOpen: false });
  const [activeConditions, setActiveConditions] = useState<ConditionEntry[]>(
    conditions || [],
  );

  const { append, remove, fields: conditionFields } = useFieldArray({
    name: 'conditionBuilder.conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const watchLogicalBuilder = useWatch({
    name: 'conditionBuilder.logical',
    control: form.control,
  });

  const childBuilderFieldArray = useFieldArray({
    name: 'conditionBuilder.childBuilder.conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  return (
    <>
      <UI.FormSection id="conditions">
        <UI.Div>
          <UI.H3 color="default.text" fontWeight={500} pb={2}>{t('automation:conditions')}</UI.H3>
          <UI.Muted color="gray.600">
            {t('automation:conditions_helper')}
          </UI.Muted>
        </UI.Div>
        <UI.Flex>
          <UI.Div
            width="100%"
            backgroundColor="#fbfcff"
            border="1px solid #edf2f7"
            borderRadius="10px"
            padding={4}
            paddingLeft={0}
            paddingRight={0}
          >
            {(conditionFields.length) ? (
              <>
                <UI.Grid m={2} gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto">

                  <UI.Helper>{t('automation:logic')}</UI.Helper>
                  <UI.Helper>{t('automation:condition')}</UI.Helper>
                  <UI.Helper>{t('automation:operator')}</UI.Helper>
                  <UI.Helper>{t('automation:compare_to')}</UI.Helper>
                </UI.Grid>
                {conditionFields.map((condition, index) => (
                  <UI.Grid
                    key={condition?.arrayKey}
                    ml={2}
                    mr={2}
                    p={2}
                    borderRadius="6px"
                    borderBottom="1px solid #edf2f7"
                    gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto"
                    backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
                    position="relative"
                  >
                    <input defaultValue={0} type="hidden" {...form.register(`conditionBuilder.conditions.${index}.depth`)} />
                    <UI.Div>
                      {index === 1 && (
                        <Controller
                          name="conditionBuilder.logical"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              options={[{ label: 'AND', value: 'AND' }, { label: 'OR', value: 'OR' }]}
                              value={field.value as { label: string, value: string }}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      )}
                      {index > 1 && (
                        <Select
                          isDisabled
                          value={watchLogicalBuilder}
                        />
                      )}
                    </UI.Div>
                    {(condition as any)?.isGrouped && (
                      <UI.Div gridColumn="2 / 7">
                        <ChildBuilderEntry
                          activeConditions={activeConditions}
                          onAddCondition={setActiveConditions}
                          form={form}
                          openMenu={openMenu}
                          append={childBuilderFieldArray.append}
                          remove={childBuilderFieldArray.remove}
                          conditionFields={childBuilderFieldArray.fields}
                        />
                      </UI.Div>

                    )}
                    {!(condition as any)?.isGrouped && (
                      <>
                        <UI.Div alignItems="center" display="flex">
                          <Controller
                            name={`conditionBuilder.conditions.${index}.condition`}
                            control={form.control}
                            defaultValue={(condition as any)?.condition}
                            render={({ field: { value, onChange } }) => (
                              <Dropdown
                                defaultCloseOnClickOutside={false}
                                renderOverlay={({ onClose, setCloseClickOnOutside }) => (
                                  <ConditionNodePicker
                                    onAddCondition={setActiveConditions}
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
                            name={`conditionBuilder.conditions.${index}.operator`}
                            defaultValue={undefined}
                            control={form.control}
                            render={({ field: { value, onChange } }) => (
                              <Select options={OPERATORS} onChange={onChange} value={value} />
                            )}
                          />
                        </UI.Div>
                        <UI.FormControl isRequired>
                          <UI.Input
                            {...form.register(`conditionBuilder.conditions.${index}.compareTo`, { required: true })}
                          />
                        </UI.FormControl>
                        <UI.Icon
                          color="#808b9a"
                          style={{ cursor: 'pointer' }}
                          mr={1}
                          onClick={(e) => openMenu(e, condition)}
                        >
                          <MoreVertical />
                        </UI.Icon>
                      </>
                    )}

                  </UI.Grid>
                ))}
                <UI.Div ml={4} mt={4}>
                  <UI.Button
                    variantColor="gray"
                    onClick={
                      () => append({
                        depth: 0,
                        compareTo: undefined,
                        operator: null,
                        condition: undefined,
                      })
                    }
                  >
                    <UI.Icon mr={1}>
                      <PlusCircle />
                    </UI.Icon>
                    {t('add_condition')}
                  </UI.Button>
                </UI.Div>
              </>
            ) : (
              <UI.IllustrationCard svg={<EmptyIll />} text={t('trigger:condition_placeholder')}>
                <Button
                  leftIcon={() => <PlusCircle />}
                  onClick={() => setCreateModalIsOpen({ isOpen: true, modal: ModalType.CreateCondition })}
                  size="sm"
                  variant="outline"
                  variantColor="teal"
                >
                  {t('trigger:add_condition')}
                </Button>
              </UI.IllustrationCard>
            )}
          </UI.Div>
        </UI.Flex>
        <UI.Hr />
      </UI.FormSection>

      <Menu.Base
        {...menuProps}
        onClose={closeMenu}
      >
        <Menu.Header>
          {t('actions')}
        </Menu.Header>

        <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled={false}
          onClick={() => {
            if (activeItem.isGrouped) {
              const conditionIndex = childBuilderFieldArray.fields.findIndex(
                (field) => field.arrayKey === activeItem.arrayKey,
              );
              if (childBuilderFieldArray.fields.length === 1) {
                const groupCondition = conditionFields.findIndex(
                  (condition) => ((condition as any)?.isGrouped) === true,
                );
                if (groupCondition !== -1) {
                  remove(groupCondition);
                }
              }
              childBuilderFieldArray.remove(conditionIndex);
            } else {
              const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);
              remove(conditionIndex);
            }
          }}
        >
          <UI.Flex color="#4A5568">
            <UI.Icon mr={1} width={5}>
              <Trash2 color="#4A5568" width="18px" height="auto" />
            </UI.Icon>
            {t('automation:remove')}
          </UI.Flex>
        </Menu.Item>
        <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled={false}
          onClick={() => {
            const { arrayKey, ...activeConditionBuilder } = activeItem;
            if (activeItem.isGrouped) {
              childBuilderFieldArray.append(activeConditionBuilder);
            } else {
              append(activeConditionBuilder);
            }
          }}
        >
          <UI.Flex color="#4A5568">
            <UI.Icon mr={1} width={5}>
              <Copy color="#4A5568" width="18px" height="auto" />
            </UI.Icon>
            {t('automation:duplicate')}
          </UI.Flex>
        </Menu.Item>
        {/* <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled
          onClick={() => {
            const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);

            const { arrayKey, ...activeConditionBuilder } = activeItem;
            const groupedCondition = { ...activeItem, isGrouped: true };
            childBuilderFieldArray.append(activeConditionBuilder);
            update(conditionIndex, groupedCondition);
          }}
        >
          <UI.Flex color="#4A5568">
            <UI.Icon mr={1} width={5}>
              <RefreshCcw color="#4A5568" width="18px" height="auto" />
            </UI.Icon>
            {t('automation:turn_into_group')}
          </UI.Flex>
        </Menu.Item> */}
      </Menu.Base>

      <Modal.Root
        open={createModalIsOpen.isOpen && createModalIsOpen.modal === ModalType.CreateCondition}
        onClose={() => setCreateModalIsOpen({ isOpen: false })}
      >
        <CreateConditionModalCard
          onClose={() => setCreateModalIsOpen({ isOpen: false })}
          onSuccess={(condition: ConditionEntry) => {
            append({ condition: condition as any });
            setActiveConditions((oldConditions) => [...oldConditions, condition]);
          }}
        />
      </Modal.Root>
    </>
  );
};
