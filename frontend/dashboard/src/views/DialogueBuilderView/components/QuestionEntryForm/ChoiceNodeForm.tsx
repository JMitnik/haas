import * as UI from '@haas/ui';
import Dropdown from 'components/Dropdown';
import React from 'react'
import { PlusCircle, Crosshair } from 'react-feather';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import { ReactComponent as ExclamationIcon } from 'assets/icons/icon-exclamation-circle.svg';
import { Controller, UseFormMethods } from 'react-hook-form';
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

const NodeCell = ({ node }: { node: any }) => {
  if (!node.type) return null;

  const nodeProps = MapNodeToProperties(node.type);
  console.log(node);

  return (
    <NodeCellContainer style={{ padding: '8px 12px' }}>
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

const DropdownMenu = ({ onChange, onClose, items }: any) => {
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

export const ChoiceNodeForm = ({ choices, form, ctaNodes }: ChoiceNodeFormProps) => {
  const { t } = useTranslation();
  const [testState, setTestState] = useState<any>();

  const handleOptionChange = (choice: any, idx: number) => console.log("Add");

  const currentItems = [1, 1];

  const options = form.watch('optionsFull');

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
          border="1px solid #edf2f7" borderRadius="10px" padding={4}>
          <UI.Grid gridTemplateColumns="1fr 1fr 1fr">
            <UI.Helper>
              Choice
              </UI.Helper>
            <UI.Helper>Call to Action</UI.Helper>
            <UI.Helper>Leads to</UI.Helper>
          </UI.Grid>
          {options.map((choice: any, index: number) => (
            <UI.Grid p={2} borderBottom="1px solid #edf2f7" gridTemplateColumns="1fr 1fr 1fr">
              <UI.Div position="relative" width="100%" borderRight="1px solid #edf2f7">
                <UI.GradientButton>
                  {choice.value}
                </UI.GradientButton>
                {/* <UI.Div>
                  <ExclamationIcon />
                </UI.Div> */}
              </UI.Div>
              <UI.Div>
                <Controller
                  name={`optionsFull.[${index}].overrideLeaf`}
                  control={form.control}
                  render={() => (
                    <Dropdown renderOverlay={({ onClose }) => (
                      <DropdownMenu items={ctaNodes.map(ctaNode => ({
                        value: ctaNode.id,
                        label: ctaNode.title,
                        type: ctaNode.type
                      }))} onClose={onClose}
                        onChange={(item: any) => form.setValue(`optionsFull.[${index}].overrideLeaf`, item)}
                      />
                    )}>
                      {() => (
                        <UI.Div>
                          {choice?.overrideLeaf?.label ? (
                            <NodeCell node={choice?.overrideLeaf} />
                          ) : (
                              // TODO: Make it a theme?
                              <UI.Button
                                variantColor="gray"
                                size="sm"
                                color="#718096"
                                backgroundColor="white"
                                border="1px solid #edf2f7"
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
            </UI.Grid>
          ))}
        </UI.Div>
      </UI.Flex>

      {choices && choices.map((choice, index) => (
        <UI.Flex key={`container-${choice.id}-${index}`} flexDirection="column">
          <UI.Flex my={1} flexDirection="row">
            <UI.Flex flexGrow={1}>
              <UI.Input
                isInvalid={form.errors.options && Array.isArray(form.errors.options) && !!form.errors.options?.[index]}
                id={`choices[${index}]`}
                key={`input-${choice.id}-${index}`}
                name={`choices[${index}]`}
                ref={form.register({
                  required: true,
                  minLength: 1
                })}
                defaultValue={choice.value}
                onChange={(e: any) => handleOptionChange(e.currentTarget.value, index)}
              />
            </UI.Flex>
            {/* 
                      <DeleteQuestionOptionButtonContainer
                      onClick={(e: any) => deleteOption(e, index)}
                      >
                      <MinusCircle />
                      </DeleteQuestionOptionButtonContainer> */}
          </UI.Flex>
          {form.errors.options?.[index] && (
            <UI.Muted color="warning">Please fill in a proper value!</UI.Muted>
          )}
        </UI.Flex>
      ))}
    </UI.Div>
  )
};