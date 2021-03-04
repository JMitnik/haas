import * as UI from '@haas/ui';
import Dropdown from 'components/Dropdown';
import React from 'react'
import { PlusCircle, ArrowUp, ArrowDown, Trash } from 'react-feather';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import { Controller, useFieldArray, UseFormMethods } from 'react-hook-form';
import { useTranslation } from 'react-i18next/';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import { useState } from 'react';
import { CTANode } from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { useEffect } from 'react';
import { NodeCellContainer } from 'views/DialogueBuilderView/DialogueBuilderStyles';

export interface ChoiceProps {
  id: string;
  value: string;
  overrideLeafId: string;
}

export interface ChoiceNodeFormProps {
  choices: ChoiceProps[];
  ctaNodes: CTANode[];
  form: UseFormMethods<any>;
}

const CloseButtonContainer = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 1rem;
  height: 1rem;
`;

const CloseButton = ({ onClose }: any) => (
  <CloseButtonContainer onClick={onClose}>
    <CloseIcon />
  </CloseButtonContainer>
)

const NodeCell = ({ node, onOpen }: { node: any, onOpen?: () => void }) => {
  if (!node.type) return null;

  const nodeProps = MapNodeToProperties(node.type);

  return (
    <NodeCellContainer onClick={onOpen} style={{ padding: '8px 12px', width: "100%" }}>
      <UI.Flex width="100%">
        <UI.Icon
          bg={nodeProps.bg}
          color={nodeProps.color}
          height="2rem"
          width="2rem"
          stroke={nodeProps.stroke || undefined}
          style={{ flexShrink: 0 }}
          mr={3}
        >
          <nodeProps.icon />
        </UI.Icon>
        <UI.Div>
          <UI.Text>
            {node.label}
          </UI.Text>
          <UI.MicroLabel bg={nodeProps.bg} color={nodeProps.color !== 'transparent' ? nodeProps.color : nodeProps.stroke}>
            {node.type}
          </UI.MicroLabel>
        </UI.Div>
      </UI.Flex>
    </NodeCellContainer>
  )
}

const DropdownOption = (props: any) => {
  const nodeProps = MapNodeToProperties(props.data.type);

  return (
    <NodeCellContainer>
      <components.Option {...props}>
        <UI.Flex>
          <UI.Icon
            bg={nodeProps.bg}
            color={nodeProps.color}
            height="2rem"
            width="2rem"
            stroke={nodeProps.stroke || undefined}
            style={{ flexShrink: 0 }}
            mr={3}
          >
            <nodeProps.icon />
          </UI.Icon>
          <UI.Div>
            <UI.Text>
              {props.label}
            </UI.Text>
            <UI.MicroLabel bg={nodeProps.bg} color={nodeProps.color !== 'transparent' ? nodeProps.color : nodeProps.stroke}>
              {props.data.type}
            </UI.MicroLabel>
          </UI.Div>
        </UI.Flex>
      </components.Option>
    </NodeCellContainer>
  );
};

const DropdownSingleValue = (props: any) => {
  // const nodeProps = MapNodeToProperties(props.data.type);

  return (
    <components.SingleValue {...props}>
      <UI.Flex>
        <UI.Span color="gray.300">
          {props?.data?.label}
        </UI.Span>
      </UI.Flex>
    </components.SingleValue>
  )
};

const ChoiceDropdown = ({ onChange, onClose, value }: any) => {
  const { t } = useTranslation();

  return (
    <UI.List maxWidth={400}>
      <UI.ListHeader>Choice</UI.ListHeader>
      <CloseButton onClose={onClose} />
      <UI.ListItem hasNoSelect width="100%">
        <UI.FormControl width="100%" isRequired>
          <UI.FormLabel htmlFor="value">{t('choice')}</UI.FormLabel>
          <UI.Textarea width="100%" name="value" defaultValue={value} onChange={onChange} />
        </UI.FormControl>
      </UI.ListItem>
    </UI.List>
  );
}

const NodePicker = ({ onChange, onClose, items }: any) => {
  const [filteredState, setFilteredState] = useState<QuestionNodeTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (!filteredState) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item: any) => item.type === filteredState));
    }
  }, [filteredState, setFilteredItems, items]);

  return (
    <UI.List maxWidth={300}>
      <CloseButton onClose={onClose} />
      <UI.ListHeader>Call to action</UI.ListHeader>
      <UI.ListItem hasNoSelect width="100%">
        <UI.Div width="100%">
          <UI.Div mb={2}>
            <UI.Text fontWeight="">Filter by type</UI.Text>
            <UI.Switch>
              <UI.SwitchItem
                isActive={!filteredState}
                onClick={() => setFilteredState(null)}>
                All
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === QuestionNodeTypeEnum.Link}
                onClick={() => setFilteredState(QuestionNodeTypeEnum.Link)}
              >
                Link
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === QuestionNodeTypeEnum.Share}
                onClick={() => setFilteredState(QuestionNodeTypeEnum.Share)}
              >
                Share
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === QuestionNodeTypeEnum.Form}
                onClick={() => setFilteredState(QuestionNodeTypeEnum.Form)}
              >
                Form
              </UI.SwitchItem>
            </UI.Switch>
          </UI.Div>
          <UI.Div>
            <UI.Text>Search</UI.Text>
            <Select
              menuIsOpen
              autoFocus
              defaultValue={{ label: 'Test2', value: 'Test2' }}
              options={filteredItems}
              onChange={onChange}
              components={{
                Option: DropdownOption,
                SingleValue: DropdownSingleValue,
              }}
              styles={{
                menu: () => ({
                  marginTop: 0
                }),
                control: (provided) => ({
                  ...provided,
                  borderWidth: 1,
                })
              }}
            />
          </UI.Div>
        </UI.Div>
      </UI.ListItem>
    </UI.List>
  )
};

export const ChoiceNodeForm = ({ form, ctaNodes }: ChoiceNodeFormProps) => {
  const { t } = useTranslation();

  const choicesForm = useFieldArray({
    name: 'optionsFull',
    control: form.control,
    keyName: 'fieldIndex'
  });

  const formattedCtaNodes = ctaNodes.map(ctaNode => ({
    value: ctaNode.id,
    label: ctaNode.title,
    type: ctaNode.type
  }));

  const handleNewChoice = () => {
    choicesForm.append({
      value: '',
      overrideLeaf: null
    })
  }

  return (
    <UI.Div>
      {/* TODO: Any generic helper with this? */}
      {/* {!choices.length && !form.errors.options && (
        <UI.Muted>{t('dialogue:add_option_reminder')}</UI.Muted>
      )}

      {!choices.length && form.errors.options && (
        <UI.Muted color="red">{t('dialogue:empty_option_reminder')}</UI.Muted>
      )} */}

      <UI.Flex>
        <UI.Div
          width="100%"
          backgroundColor="#fbfcff"
          border="1px solid #edf2f7"
          borderRadius="10px"
          padding={4}
        >
          <UI.Grid gridTemplateColumns="2fr 2fr 1fr">
            <UI.FormControl isRequired>
              <UI.FormLabel display="flex">
                <UI.Helper>
                  Choice
                </UI.Helper>
              </UI.FormLabel>
            </UI.FormControl>
            <UI.Helper>Call to Action</UI.Helper>
          </UI.Grid>
          {choicesForm.fields.map((choice, index) => (
            <UI.Grid
              key={choice.fieldIndex}
              p={2}
              borderBottom="1px solid #edf2f7"
              gridTemplateColumns="2fr 2fr 1fr"
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
                  defaultValue={choice.value}
                  control={form.control}
                  render={({ value, onChange }) => (
                    <Dropdown placement="left-start" renderOverlay={({ onClose }) => (
                      <ChoiceDropdown
                        value={value}
                        onChange={onChange}
                        onClose={onClose}
                      />
                    )}>
                      {({ onOpen, containerRef }) => (
                        <>
                          {value ? (
                            <UI.GradientButton onClick={onOpen} ref={containerRef}>
                              {value}
                            </UI.GradientButton>
                          ) : (
                              <UI.Button
                                variantColor="altGray"
                                size="sm"
                                variant="outline"
                                onClick={onOpen}
                              >
                                <UI.Icon mr={1}>
                                  <PlusCircle />
                                </UI.Icon>
                              Set your choice
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
                    )}>
                      {({ onOpen }) => (
                        <UI.Div
                          width="100%"
                          justifyContent="center"
                          display="flex"
                          alignItems="center"
                        >
                          {value?.label ? (
                            <NodeCell onOpen={onOpen} node={value} />
                          ) : (
                              <UI.Button
                                variantColor="altGray"
                                size="sm"
                                variant="outline"
                                onClick={onOpen}
                              >
                                <UI.Icon mr={1}>
                                  <PlusCircle />
                                </UI.Icon>
                              Add Call-to-Action
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
            <UI.Button variantColor="gray" onClick={handleNewChoice}>
              <UI.Icon mr={1}>
                <PlusCircle />
              </UI.Icon>
              Add choice
            </UI.Button>
          </UI.Div>
        </UI.Div>
      </UI.Flex>
    </UI.Div>
  )
};