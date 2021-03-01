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
import { MapNodeToIcon } from 'components/MapNodeToIcon';
import { QuestionNodeTypeEnum } from 'types/globalTypes';
import { useEffect } from 'react';

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

const CloseButtonContainer = styled.button`
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

const DropdownMenu = ({ onChange, onClose, items }: any) => {
  const [filteredState, setFilteredState] = useState<QuestionNodeTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (!filteredState) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item: any) => item.type === filteredState));
    }
  }, [ filteredState, setFilteredItems ]);

  return (

    <UI.List maxWidth={300}>
      <CloseButton onClose={onClose} />
      <UI.ListHeader>Call to action</UI.ListHeader>
      <UI.ListItem hasNoSelect width="100%">
        <UI.Div width="100%">
          <UI.Div mb={2}>
            <UI.Switch>
              <UI.SwitchItem 
                isActive={!filteredState} 
                onClick={() => setFilteredState(null)}>
                All
              </UI.SwitchItem>
              <UI.SwitchItem 
                isActive={filteredState === QuestionNodeTypeEnum.LINK} 
                onClick={() => setFilteredState(QuestionNodeTypeEnum.LINK)}
              >
                Link
              </UI.SwitchItem>
              <UI.SwitchItem 
                isActive={filteredState === QuestionNodeTypeEnum.SHARE} 
                onClick={() => setFilteredState(QuestionNodeTypeEnum.SHARE)}
              >
                Share
              </UI.SwitchItem>
              <UI.SwitchItem 
                isActive={filteredState === QuestionNodeTypeEnum.FORM} 
                onClick={() => setFilteredState(QuestionNodeTypeEnum.FORM)}
              >
                Form
              </UI.SwitchItem>
            </UI.Switch>
          </UI.Div>
          <Select
            menuIsOpen
            autoFocus
            defaultValue={{ label: 'Test2', value: 'Test2' }} 
            options={filteredItems}
            onChange={onChange}
            components={{
              Option: (props) => {
                const Icon = MapNodeToIcon(props.data.type);

                return (
                  <>
                    <components.Option {...props}>
                      <UI.Flex>
                        <UI.Icon width="1rem">
                          <Icon width="1rem" />
                        </UI.Icon>
                        <UI.Text ml={1}>
                          {props.label}
                        </UI.Text>
                      </UI.Flex>
                    </components.Option>
                  </>
                )
              },
              SingleValue: (props) => {
                return (
                  <components.SingleValue {...props}>
                    <UI.Flex>
                        <UI.Icon>
                          <Crosshair />
                        </UI.Icon>
                        <UI.Span ml={1}>
                          {props?.data?.label}
                        </UI.Span>
                      </UI.Flex>
                  </components.SingleValue>
                )
              }
            }}
            styles={{
              menu: () => ({
                marginTop: 0
              }),
              control: (provided) => ({
                ...provided,
                borderWidth: 0
              })
            }}
          />
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
                            <UI.Button 
                            variantColor="gray" 
                            size="sm" 
                            color="#718096" 
                            backgroundColor="white"
                            border="1px solid #edf2f7"
                            whiteSpace="normal"
                          >
                            {choice?.overrideLeaf?.label}
                          </UI.Button>
                            ): (
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