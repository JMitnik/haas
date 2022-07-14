import * as Select from '@radix-ui/react-select';
import React from 'react';
import styled, { css } from 'styled-components';

export const SelectTrigger = styled(Select.Trigger)`
${({ theme }) => css`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 13px;
  line-height: 1;
  height: 35px;
  gap: 5px;
  border: 1px solid #edf2f7;
  background-color: white;
  color: ${theme.colors.main['500']};
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);

  &:hover { 
    background-color: ${theme.colors.main['50']};
  };
  
  `}
`;

export const SelectContent = styled(Select.Content)`
 ${({ theme }) => css`
  overflow: hidden;
  background-color: white;
  border-radius: 6px;
  box-shadow:
    0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  `}
`;

export const SelectViewport = styled(Select.Viewport)`
  ${({ theme }) => css`
    padding: 5px;
  `}
`;

export const SelectItem = styled(Select.Item)`
  ${({ theme }) => css`
  all: unset;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  font-size: 13px,
  line-height: 1,
  color: ${theme.colors.main['500']},
  border-radius: 3px,
  height: 25px;
  padding: 0 35px 0 25px;
  
  user-select: none;

  :hover {
    background-color: ${theme.colors.main['50']};
  }

  &[data-disabled] {
    color: ${theme.colors.gray['500']};
    pointer-events: none;
  },

  `}
`;
export const SelectLabel = styled(Select.Label)`
  ${({ theme }) => css`
  padding: 0 25px;
  font-size: 12px,
  line-height: 25px;
  color: ${theme.colors.main['700']};
  `}
`;

export const SelectSeparator = styled(Select.Separator)`
${({ theme }) => css`
  height: 1px;
  background-color: ${theme.colors.main['50']};
  margin: 5px;
  `}
`;

export const SelectItemIndicator = styled(Select.ItemIndicator)`
  ${({ theme }) => css`
    position: absolute;
    left: 0;
    width: 25;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `}
`;

export const SelectScrollUpButton = styled(Select.ScrollUpButton)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25;
    background-color: white;
    color: ${theme.colors.main['900']};
    cursor: default;
  `}
`;

export const SelectScrollDownButton = styled(Select.ScrollDownButton)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25;
    background-color: white;
    color: ${theme.colors.main['900']};
    cursor: default;
  `}
`;

export const { Root } = Select;
export const SelectValue = Select.Value;
export const SelectIcon = Select.Icon;
export const SelectItemText = Select.ItemText;
export const SelectGroup = Select.Group;

export default () => (
  <Select.Root>
    <Select.Trigger>
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>

    <Select.Content>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item value="option 1">
          <Select.ItemText />
          <Select.ItemIndicator />
        </Select.Item>

        <Select.Group>
          <Select.Label />
          <Select.Item value="option 2">
            <Select.ItemText />
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Group>

        <Select.Separator />
      </Select.Viewport>
      <Select.ScrollDownButton />
    </Select.Content>
  </Select.Root>
);
