import * as Select from '@radix-ui/react-select';
import styled, { css } from 'styled-components';

export const SelectTrigger = styled(Select.Trigger)`
  ${({ theme, disabled }) => css`
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: ${!disabled ? 'pointer' : 'not-allowed'};
    border-radius: 4px;;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 0.9rem;
    line-height: 1;
    height: 35px;
    gap: 5px;
    border: 1px solid #edf2f7;
    background-color: white;
    color: ${theme.colors.main['500']};
    box-shadow: ${theme.boxShadows.sm};

    &:hover {
      background-color: ${!disabled ? theme.colors.main['50'] : 'auto'};
    };
  `}
`;

export const SelectContent = styled(Select.Content)`
 ${({ theme }) => css`
  overflow: hidden;
  background-color: white;
  border-radius: 6px;
  box-shadow: ${theme.boxShadows.sm};
  `}
`;

export const SelectViewport = styled(Select.Viewport)``;

export const SelectItem = styled(Select.Item)`
  ${({ theme }) => css`
    all: unset;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;

    font-size: 0.9rem;
    line-height: 1;
    border-radius: 3px;
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
    font-size: 0.9rem;
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
  position: absolute;
  left: 0;
  width: 25;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
