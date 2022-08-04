import * as UI from '@haas/ui';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import * as Popover from 'components/Common/Popover';

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
}

/**
 * PickerButton that triggers a Popover.
 */
export const PickerButton = ({ children, label, icon }: PickerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Popover.Trigger asChild>
        <PickerButtonContainer data-testid="picker" as="button">
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
      <Popover.Content isOpen={isOpen}>
        <UI.Card maxWidth={700}>
          {children?.(handleClose)}
        </UI.Card>
      </Popover.Content>
    </Popover.Root>
  );
};
