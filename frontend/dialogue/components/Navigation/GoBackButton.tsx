import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';
import chroma from 'chroma-js';
import { ChevronLeft } from 'react-feather';

import { useDialogueParams } from './useDialogueParams';
import { useNavigator } from './useNavigator';
import { makeColorfulBoxShadow } from '../../utils/makeColorfulBoxShadow';

const makeLinearBackground = (color: string, endOpacity = 0.56) => {
  if (chroma(color).luminance() > 0.5) {
    return `linear-gradient(160grad, ${chroma(color).darken(0.5).hex()} 0%, hsla(222.9, 70.3%, 41%, ${endOpacity}))`;
  } else {
    return `linear-gradient(160grad, ${chroma(color).brighten(0.5).hex()} 0%, hsla(222.9, 70.3%, 41%, ${endOpacity}))`;
  }
}

const GoBackButtonContainer = styled.button`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: -80px;
    top: 20px;
    background: ${makeLinearBackground(theme.colors._primary, 1)};
    padding: 4px 8px;
    border-radius: 10px;
    opacity: 1;
    z-index: 40;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1px solid #4a63dc;

    &:hover {
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      background: ${makeLinearBackground(chroma(theme.colors._primary).brighten(0.5).hex(), 1)};
      box-shadow: ${makeColorfulBoxShadow(theme.colors._primary, true)};
    }
  `}
`;

export const GoBackButton = () => {
  const { workspace, dialogue } = useDialogueParams();
  const { goBack } = useNavigator({ dialogueSlug: dialogue, workspaceSlug: workspace });

  return (
    <GoBackButtonContainer onClick={goBack}>
      <UI.Icon>
        <ChevronLeft />
      </UI.Icon>
    </GoBackButtonContainer>
  )
};
