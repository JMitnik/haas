import * as UI from '@haas/ui';
import { ArrowDown, ArrowUp, PlusCircle, Trash } from 'react-feather';
import { Controller, UseFormMethods, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import React from 'react';

import { CTANode } from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { NodeCell } from 'components/NodeCell';
import { NodePicker } from 'components/NodePicker';
import { TopicPicker } from 'components/TopicPicker';

export interface ChoiceProps {
  id: string;
  value: string;
  overrideLeafId: string;
}

const ChoiceDropdown = ({ onChange, onClose, value }: any) => {
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
  form: UseFormMethods<any>;
  topics: any[];
}

export const ChoiceNodeForm = ({ form, ctaNodes, topics }: ChoiceNodeFormProps) => {
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
    });
  };

  const activeFormTopic = form.watch('topic');
  const activeTopic = topics.find((topic) => topic.id === activeFormTopic?.value);
  const availableTopicValues = activeTopic?.topicValues || [];

  const hasSelectedTopic = !!activeFormTopic;
  const choiceGridColumns = hasSelectedTopic ? '2fr 2fr 2fr 1fr' : '2fr 2fr 1fr';

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
              <UI.Grid gridTemplateColumns={choiceGridColumns}>
                {hasSelectedTopic && (
                  <UI.Helper>{t('topic_value')}</UI.Helper>
                )}
                <UI.FormControl isRequired>
                  <UI.FormLabel display="flex">
                    <UI.Helper>
                      {t('choice')}
                    </UI.Helper>
                  </UI.FormLabel>
                </UI.FormControl>
                <UI.Helper>{t('call_to_action')}</UI.Helper>
              </UI.Grid>
              {choicesForm.fields.map((choice, index) => (
                <UI.Grid
                  key={choice.fieldIndex}
                  p={2}
                  borderBottom="1px solid #edf2f7"
                  gridTemplateColumns={choiceGridColumns}
                >
                  {hasSelectedTopic && (
                    <UI.Div>
                      <Controller
                        name={`optionsFull[${index}].relatedTopicValue`}
                        control={form.control}
                        render={({ onChange, value }) => (
                          <Dropdown
                            renderOverlay={({ onClose }) => (
                              <TopicPicker
                                items={availableTopicValues}
                                onClose={onClose}
                                onChange={onChange}
                              />
                            )}
                          >
                            {({ onOpen, reference }) => (
                              <>
                                {value ? (
                                  <UI.Button onClick={onOpen} ref={reference}>
                                    {value.label}
                                  </UI.Button>
                                ) : (
                                  <UI.Button onClick={onOpen} ref={reference}>
                                    Select topic
                                  </UI.Button>
                                )}
                              </>
                            )}
                          </Dropdown>
                        )}
                      />
                    </UI.Div>
                  )}
                  <UI.Div
                    display="flex"
                    alignItems="center"
                    position="relative"
                    width="100%"
                    borderRight="1px solid #edf2f7"
                  >
                    <Controller
                      name={`optionsFull[${index}].value`}
                      defaultValue={choice.value}
                      control={form.control}
                      render={({ value, onChange }) => (
                        <Dropdown
                          renderOverlay={({ onClose }) => (
                            <ChoiceDropdown
                              value={value}
                              onChange={onChange}
                              onClose={onClose}
                            />
                          )}
                        >
                          {({ onOpen, containerRef }) => (
                            <>
                              {value ? (
                                <UI.GradientButton onClick={onOpen} ref={containerRef}>
                                  {value}
                                </UI.GradientButton>
                              ) : (
                                <UI.Button
                                  size="sm"
                                  variantColor={
                                    form.errors?.optionsFull?.[index].value ? 'red' : 'altGray'
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
                      defaultValue={choice.overrideLeaf}
                      render={({ value, onChange }) => (
                        <Dropdown renderOverlay={({ onClose }) => (
                          <NodePicker
                            items={formattedCtaNodes}
                            onClose={onClose}
                            onChange={onChange}
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
                              {value?.label ? (
                                <NodeCell onClick={onOpen} node={value} />
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
            <UI.IllustrationCard isFlat svg={<EmptyIll />} text={t('no_choices')}>
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
