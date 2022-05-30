import * as UI from '@haas/ui';
import { useDisclosure } from '@chakra-ui/core';
import React from 'react';
import styled, { css } from 'styled-components';

import * as Popover from 'components/Common/DeprecatedPopover';

const PickerButtonContainer = styled(UI.Div)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    border: none;
    padding: 6px 10px;
    font-weight: 700;
    color: ${theme.colors.gray[500]};
    transition: all ease-in 0.2s;

    &:hover {
      box-shadow: 0 4px 6px rgba(50,50,93,.18), 0 1px 3px rgba(0,0,0,.11);
      transition: all ease-in 0.2s;
    }

    ${UI.Span} {
      padding-left: ${theme.gutter / 3}px;
    }

    ${UI.Icon} {
      padding-right: ${theme.gutter / 3}px;
      border-right: 1px solid ${theme.colors.gray[200]};
      color: ${theme.colors.gray[500]};
    }
  `}
`;

interface PickerButtonProps {
  children?: (onClose: () => void) => React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  arrowBg?: string;
}

/**
 * PickerButton that triggers a Popover.
 */
export const PickerButton = ({ children, label, icon, arrowBg = 'white' }: PickerButtonProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover.Base
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Popover.Trigger>
        <PickerButtonContainer as="button">
          {icon && (
            <UI.Icon>
              {icon}
            </UI.Icon>
          )}
          <UI.Span>
            {label}
          </UI.Span>
        </PickerButtonContainer>
      </Popover.Trigger>
      <Popover.Body hasClose arrowBg={arrowBg} hasArrow padding={0} maxWidth={700}>
        {children?.(onClose)}
      </Popover.Body>
    </Popover.Base>
  );
};
