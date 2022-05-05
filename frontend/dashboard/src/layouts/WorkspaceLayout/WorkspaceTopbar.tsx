import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { Logo, LogoContainer } from 'components/Logo';

export const TopbarContainer = styled(UI.Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter / 4}px ${theme.gutter * 1.5}px;
    background: ${theme.colors.app.topbar};
    border-bottom: 1px solid ${theme.colors.gray[100]};
    width: 100%;

    ${LogoContainer} {
      color: ${theme.colors.off[600]};
    }
  `}
`;

const WorkspaceTopbar = () => (
  <TopbarContainer>
    <UI.Container>
      <UI.Flex justifyContent="space-between" alignItems="center">
        <Logo />
      </UI.Flex>
    </UI.Container>
  </TopbarContainer>
);

export { WorkspaceTopbar };
