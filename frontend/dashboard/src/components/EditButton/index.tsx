import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Button, Span } from '@haas/ui';
import { Edit3 } from 'react-feather';

interface EditButtonProps {
  isDisabled: boolean | undefined;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const EditButtonContainer = styled(Button)`
    ${({ theme, disabled }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.white};
    border: ${theme.colors.app.mutedOnWhite} 1px solid;
    border-radius: ${theme.borderRadiuses.subtleRounded};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    min-width: 80px;
    display: flex;
    ${!disabled && css`
      &:hover {
        transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.2) !important;
      }
    `}
    svg {
        margin-right: 10px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const EditButton = ({ isDisabled, onClick } : EditButtonProps) => (
  <EditButtonContainer
    disabled={isDisabled}
    onClick={onClick}
  >
    <Edit3 />
    <Span>
      Edit
    </Span>
  </EditButtonContainer>
);

export default EditButton;
