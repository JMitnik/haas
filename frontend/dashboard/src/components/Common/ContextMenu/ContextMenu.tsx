import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

const StyledContent = styled(ContextMenuPrimitive.Content)`
  ${({ theme }) => css`
    min-width: 220px;
    background-color: white;
    border-radius: ${theme.borderRadiuses.rounded}px;
    overflow: hidden;
    padding: 5px;
    box-shadow: ${theme.boxShadows.md};
  `}
`;

const Content = (props: any) => (
  <ContextMenuPrimitive.Portal>
    <StyledContent {...props} />
  </ContextMenuPrimitive.Portal>
);

const StyledSubContent = styled(ContextMenuPrimitive.SubContent)`
  ${({ theme }) => css`
    min-width: 220px;
    background-color: white;
    border-radius: ${theme.borderRadiuses.rounded}px;
    overflow: hidden;
    padding: 5px;
    box-shadow: ${theme.boxShadows.md};
  `}
`;

const SubContent = (props: any) => (
  <ContextMenuPrimitive.Portal>
    <StyledSubContent {...props} />
  </ContextMenuPrimitive.Portal>
);

const StyledItem = styled(ContextMenuPrimitive.Item)`
  ${({ theme }) => css`
    all: unset;
    position: relative;
    display: flex;
    align-items: center;

    padding: 0 5px;

    line-height: 1;
    height: 25px;
    user-select: none;

    font-size: 13px;
    color: ${theme.colors.main['500']};
    border-radius: ${theme.borderRadiuses.sm};

    &[data-disabled] {
      color: ${theme.colors.altGray['300']};
      pointer-events: none;
    }

    &[data-highlighted] {
      background-color: ${theme.colors.main['500']};
      color: white;
    };
  `}
`;

const StyledCheckboxItem = styled(ContextMenuPrimitive.CheckboxItem)`
  ${({ theme }) => css`
    all: unset;
    position: relative;
    display: flex;
    align-items: center;

    padding: 0 5px;

    line-height: 1;
    height: 25px;
    user-select: none;

    font-size: 13px;
    color: ${theme.colors.main['500']};
    border-radius: ${theme.borderRadiuses.sm};

    ${UI.Icon} {
      position: absolute;
      left: 5px;
    }

    ${UI.Span} {
      position: absolute;
      left: 30px;
    }

    &[data-disabled] {
      color: ${theme.colors.altGray['300']};
      pointer-events: none;
    }

    &[data-highlighted] {
      background-color: ${theme.colors.main['500']};
      color: white;
    };
  `}
`;
const StyledRadioItem = styled(ContextMenuPrimitive.RadioItem)`
  ${({ theme }) => css`
    all: unset;
    position: relative;
    display: flex;
    align-items: center;

    padding: 0 5px;

    line-height: 1;
    height: 25px;
    user-select: none;

    font-size: 13px;
    color: ${theme.colors.main['500']};
    border-radius: ${theme.borderRadiuses.sm};

    &[data-disabled] {
      color: ${theme.colors.altGray['300']};
      pointer-events: none;
    }

    &[data-highlighted] {
      background-color: ${theme.colors.main['500']};
      color: white;
    };
  `}
`;

const StyledSubTrigger = styled(ContextMenuPrimitive.SubTrigger)`
  ${({ theme }) => css`
    all: unset;
    position: relative;
    display: flex;
    align-items: center;

    padding: 0 5px;

    line-height: 1;
    height: 25px;
    user-select: none;

    font-size: 13px;
    color: ${theme.colors.main['500']};
    border-radius: ${theme.borderRadiuses.sm};

    &[data-disabled] {
      color: ${theme.colors.altGray['300']};
      pointer-events: none;
    }

    &[data-highlighted] {
      background-color: ${theme.colors.main['500']};
      color: white;
    };

    &[data-state='open'] {
      background-color: ${theme.colors.main['500']};
      color: white;
    };
  `}
`;

const StyledLabel = styled(ContextMenuPrimitive.Label)`
  ${({ theme }) => css`
    padding-left: 25px;
    font-size: 12px;
    line-height: 25px;
    color: ${theme.colors.altGray['400']};
  `}
`;

const StyledSeparator = styled(ContextMenuPrimitive.Separator)`
  ${({ theme }) => css`
    height: 1px;
    margin: 5px;
    background-color: ${theme.colors.main['100']};
  `}
`;

const StyledItemIndicator = styled(ContextMenuPrimitive.ItemIndicator)`
  ${({ theme }) => css`
    position: absolute;
    left: 0;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `}
`;

const StyledRightSlot = styled(UI.Div)`
  ${({ theme }) => css`
    margin-left: auto;
    padding-left: 20px;
    color: ${theme.colors.main['500']};
    
    [data-highlighted] > & { 
      color: white;
    };

    [data-disabled] &: { 
      ${theme.colors.altGray['300']};
    };
  `}
`;

// Exports
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuContent = Content;
export const ContextMenuItem = StyledItem;
export const ContextMenuCheckboxItem = StyledCheckboxItem;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
export const ContextMenuRadioItem = StyledRadioItem;
export const ContextMenuItemIndicator = StyledItemIndicator;
export const ContextMenuRightSlot = StyledRightSlot;
export const ContextMenuLabel = StyledLabel;
export const ContextMenuSeparator = StyledSeparator;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuSubTrigger = StyledSubTrigger;
export const ContextMenuSubContent = SubContent;
