import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { Logo, LogoContainer } from 'components/Logo';

import { Usernav } from './UserNav';

interface WorkspaceTopbarProps {

}

const TopbarContainer = styled(UI.Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter / 4}px ${theme.gutter / 2}px;
    background: ${theme.colors.app.topbar};
    border-bottom: 1px solid ${theme.colors.gray[100]};
    width: 100%;

    ${LogoContainer} {
      color: ${theme.colors.off[600]};
    }
  `}
`;

const WorkspaceTopbar = ({ }: WorkspaceTopbarProps) => {
  const { t } = useTranslation();

  return (
    <TopbarContainer>
      <UI.Flex justifyContent="space-between" alignItems="center">
        <Logo />

        <UI.Flex>
          <Usernav />
        </UI.Flex>
      </UI.Flex>
    </TopbarContainer>
  );
};

export { WorkspaceTopbar };
