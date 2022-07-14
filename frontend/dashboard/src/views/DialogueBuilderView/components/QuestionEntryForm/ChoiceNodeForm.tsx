import * as UI from '@haas/ui';
import { ArrowDown, ArrowUp, PlusCircle, Trash } from 'react-feather';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next/';
import React from 'react';

import {
  CTANode,
} from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { NodeCell } from 'components/NodeCell';
import { NodePicker } from 'components/NodePicker';
import Dropdown from 'components/Dropdown';

export interface ChoiceProps {
  id: string;
  value: string;
  overrideLeafId: string;
}

export const ChoiceDropdown = ({ onChange, onClose, value }: any) => {
  const { t } = useTranslation();

  return (
    <UI.List maxWidth={400}>
      <UI.ListHeader>{t('choice')}</UI.ListHeader>
      <UI.CloseButton onClose={onClose} />
      <UI.ListItem hasNoSelect width="100%">
        <UI.FormControl width="100%" isRequired>
          <UI.FormLabel htmlFor="value">{t('choice')}</UI.FormLabel>
          <UI.Textarea width="100%" name="value" defaultValue={value} onChange={onChange} />
        </UI.FormControl>
      </UI.ListItem>
    </UI.List>
  );
};

export interface ChoiceNodeFormProps {
  ctaNodes: CTANode[];
  form: UseFormReturn<any>;
}

export const ChoiceNodeForm = ({ form, ctaNodes }: ChoiceNodeFormProps) => {
  const { t } = useTranslation();
  const choicesForm = useFieldArray({
    name: 'optionsFull',
    control: form.control,
    keyName: 'fieldIndex',
  });

  const formattedCtaNodes = ctaNodes.map((ctaNode) => ({
    value: ctaNode.id,
    label: ctaNode.title,
    type: ctaNode.type,
  }));

  const handleAddNewChoice = () => {
    choicesForm.append({
      value: '',
      overrideLeaf: null,
      isTopic: true,
    });
  };

  const handleRemoveCTAFromOption = (index: number) => {
    const newChoice = {
      overrideLeaf: {
        label: undefined,
        value: undefined,
        type: undefined,
      },
    };

    choicesForm.update(index, newChoice);
  };

  return (
    <UI.Div>
      <UI.InputHeader>{t('dialogue:choices')}</UI.InputHeader>
      <UI.InputHelper>
        {t('dialogue:choices_helper')}
      </UI.InputHelper>
      <UI.Flex>
        {/* TODO: Make a theme out of it */}
        <UI.Div
          width="100%"
          backgroundColor="#fbfcff"
          border="1px solid #edf2f7"
          borderRadius="10px"
          padding={4}
        >
          {choicesForm.fields.length ? (
            <>
              <UI.Grid gridTemplateColumns="2fr 2fr 1fr 1fr">
                <UI.FormControl isRequired>
                  <UI.FormLabel display="flex">
                    <UI.Helper>
                      {t('choice')}
                    </UI.Helper>
                  </UI.FormLabel>
                </UI.FormControl>
                <UI.Helper>{t('call_to_action')}</UI.Helper>
                <UI.Helper>{t('is_topic')}</UI.Helper>
              </UI.Grid>
              {choicesForm.fields.map((choice: any, index) => (
                <UI.Grid
                  key={choice.fieldIndex}
                  p={2}
                  borderBottom="1px solid #edf2f7"
                  gridTemplateColumns="2fr 2fr 1fr 1fr"
                >
                  <UI.Div
                    display="flex"
                    alignItems="center"
                    position="relative"
                    width="100%"
                    borderRight="1px solid #edf2f7"
                  >
                    <Controller
                      name={`optionsFull[${index}].value`}
                      defaultValue={(choice as any)?.value}
                      control={form.control}
                      render={({ field }) => (
                        <Dropdown
                          placement="left-start"
                          renderOverlay={({ onClose }) => (
                            <ChoiceDropdown
                              value={field.value}
                              onChange={field.onChange}
                              onClose={onClose}
                            />
                          )}
                        >
                          {({ onOpen, containerRef }) => (
                            <>
                              {field.value ? (
                                <UI.GradientButton onClick={onOpen} ref={containerRef}>
                                  {field.value}
                                </UI.GradientButton>
                              ) : (
                                <UI.Button
                                  size="sm"
                                  variantColor={
                                    form.formState.errors?.optionsFull?.[index].value ? 'red' : 'altGray'
                                  }
                                  variant="outline"
                                  onClick={onOpen}
                                >
                                  <UI.Icon mr={1}>
                                    <PlusCircle />
                                  </UI.Icon>
                                  {t('set_your_choice')}
                                </UI.Button>
                              )}
                            </>
                          )}
                        </Dropdown>
                      )}
                    />
                  </UI.Div>
                  <UI.Div alignItems="center" display="flex">
                    <Controller
                      name={`optionsFull[${index}].overrideLeaf`}
                      control={form.control}
                      defaultValue={(choice as any)?.overrideLeaf}
                      render={({ field }) => (
                        <Dropdown
                          defaultCloseOnClickOutside={false}
                          renderOverlay={({ onClose, setCloseClickOnOutside }) => (
                            <NodePicker
                              items={formattedCtaNodes}
                              onClose={onClose}
                              onChange={(data) => field.onChange(data)}
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
                              {field.value?.label ? (
                                <NodeCell
                                  onRemove={() => handleRemoveCTAFromOption(index)}
                                  onClick={onOpen}
                                  node={field.value}
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
                                  {t('add_call_to_action')}
                                </UI.Button>
                              )}
                            </UI.Div>
                          )}
                        </Dropdown>
                      )}
                    />
                  </UI.Div>
                  <UI.Flex justifyContent="center">
                    <Controller
                      control={form.control}
                      name={`optionsFull[${index}].isTopic`}
                      defaultValue={choice.isTopic}
                      render={({ field: { onChange, value } }) => (
                        <UI.Checkbox
                          size="lg"
                          isChecked={value}
                          onChange={() => onChange(!value)}
                          variantColor="main"
                        />
                      )}
                    />
                  </UI.Flex>
                  <UI.Stack alignItems="center" isInline spacing={2}>
                    <UI.Stack spacing={2}>
                      <UI.Button
                        size="sm"
                        isDisabled={index === 0}
                        onClick={() => choicesForm.move(index, index - 1)}
                      >
                        <UI.Icon>
                          <ArrowUp />
                        </UI.Icon>
                      </UI.Button>
                      <UI.Button
                        size="sm"
                        isDisabled={index === choicesForm.fields.length - 1}
                        onClick={() => choicesForm.move(index, index + 1)}
                      >
                        <UI.Icon>
                          <ArrowDown />
                        </UI.Icon>
                      </UI.Button>
                    </UI.Stack>
                    <UI.Button
                      onClick={() => choicesForm.remove(index)}
                      size="sm"
                      variantColor="red"
                      variant="outline"
                    >
                      <UI.Icon>
                        <Trash />
                      </UI.Icon>
                    </UI.Button>
                  </UI.Stack>
                </UI.Grid>
              ))}
              <UI.Div mt={4}>
                <UI.Button variantColor="gray" onClick={handleAddNewChoice}>
                  <UI.Icon mr={1}>
                    <PlusCircle />
                  </UI.Icon>
                  {t('add_choice')}
                </UI.Button>
              </UI.Div>
            </>
          ) : (
            <UI.IllustrationCard svg={<EmptyIll />} text={t('no_choices')}>
              <UI.Button variantColor="gray" onClick={handleAddNewChoice}>
                <UI.Icon mr={1}>
                  <PlusCircle />
                </UI.Icon>
                {t('add_choice')}
              </UI.Button>
            </UI.IllustrationCard>
          )}
        </UI.Div>
      </UI.Flex>
    </UI.Div>
  );
};
