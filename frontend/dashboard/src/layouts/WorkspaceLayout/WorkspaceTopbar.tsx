import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { Usernav } from 'layouts/WorkspaceLayout/WorkspaceSidenav';
import LogoIcon, { LogoIconContainer } from 'components/Logo/Logo';

interface WorkspaceTopbarProps {

}

const TopbarContainer = styled(UI.Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter / 4}px ${theme.gutter / 2}px;
    background: ${theme.colors.app.topbar};
    border-bottom: 1px solid ${theme.colors.gray[100]};
    width: 100%;

    ${LogoIconContainer} {
      color: ${theme.colors.main[500]};

      svg {
        width: 100%;
        height: 100%;
      }
    }

    ${LogoIconContainer} + ${UI.Text} {
      color: ${theme.colors.main[500]};
      font-weight: 900;
      font-size: 1.5rem;
    }
  `}
`;

const WorkspaceTopbar = ({ }: WorkspaceTopbarProps) => {
  const { t } = useTranslation();

  return (
    <TopbarContainer>
      <UI.Flex justifyContent="space-between" alignItems="center">
        <UI.Flex alignItems="center">
          <LogoIcon width="60px" height="60px" justifyContent="center" />
          <UI.Text>haas</UI.Text>
        </UI.Flex>

        <UI.Flex>
          <Usernav />
        </UI.Flex>
      </UI.Flex>
    </TopbarContainer>
  );
};

export { WorkspaceTopbar };
