import * as UI from '@haas/ui';
import Dropdown from 'components/Dropdown';
import React from 'react'
import { PlusCircle, Crosshair } from 'react-feather';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import { UseFormMethods } from 'react-hook-form';
import { useTranslation } from 'react-i18next/';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import { useState } from 'react';

export interface ChoiceProps {
  id: string;
  value: string;
  overrideLeafId: string;
}

export interface ChoiceNodeFormProps {
  choices: ChoiceProps[];
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

const DropdownMenu = ({ onChange, onClose }: any) => (
  <UI.List>
    <CloseButton onClose={onClose} />
    <UI.ListHeader>Call to action</UI.ListHeader>
    <UI.ListItem hasNoSelect width="100%">
      <UI.Div width="100%">
        <Select
          menuIsOpen
          autoFocus
          defaultValue={{ label: 'Test2', value: 'Test2' }} 
          options={items}
          onChange={onChange}
          components={{
            Option: (props) => {
              return (
                <>
                  <components.Option {...props}>
                    <UI.Flex>
                      <UI.Icon>
                        <Crosshair />
                      </UI.Icon>
                      <UI.Span ml={1}>
                        {props.label}
                      </UI.Span>
                    </UI.Flex>
                  </components.Option>
                </>
              )
            },
            SingleValue: (props) => {
              console.log(props);
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

const items = [
  { label: 'Test', value: 'Test'},
  { label: 'Test2', value: 'Test2'},
]

export const ChoiceNodeForm = ({ choices, form }: ChoiceNodeFormProps) => {
  const { t } = useTranslation();
  const [testState, setTestState] = useState<any>();

  const addNewOption = () => console.log("Add");
  const handleOptionChange = (choice: any, idx: number) => console.log("Add");

  return (
    <UI.Div>
      <UI.Div mb={1} gridColumn="1 / -1">
        <UI.Flex justifyContent="space-between">
          <UI.H4>
            {t('options')}
          </UI.H4>
          <PlusCircle
            data-cy="AddOption"
            style={{ cursor: 'pointer' }} onClick={() => addNewOption()} />
        </UI.Flex>

        <UI.Hr />
      </UI.Div>

      {!choices.length && !form.errors.options && (
        <UI.Muted>{t('dialogue:add_option_reminder')}</UI.Muted>
      )}

      {!choices.length && form.errors.options && (
        <UI.Muted color="red">{t('dialogue:empty_option_reminder')}</UI.Muted>
      )}

      <UI.Flex>
        <UI.Div p={4}>
          <Dropdown placement="right" renderOverlay={({ onClose }) => (
            <DropdownMenu onClose={onClose} onChange={(item: any) => setTestState(item)} />
          )}>
            {() => (
              <UI.Div p={4}>
                <UI.Label>{testState?.label}</UI.Label>
              </UI.Div>
            )}
          </Dropdown>
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