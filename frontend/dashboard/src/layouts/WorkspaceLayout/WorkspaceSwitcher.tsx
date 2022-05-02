import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { Avatar } from 'components/Common/Avatar';
import { ReactComponent as SwitchIcon } from 'assets/icons/icon-switch.svg';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

const WorkspaceSwitcherContainer = styled(UI.Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    border-top: 1px solid ${theme.colors.gray[200]};
    border-right: 1px solid ${theme.colors.neutral[500]};
    transition: all 0.2s ease-in;

    &:hover {
      background: ${theme.colors.off[100]};
      transition: all 0.2s ease-in;

      cursor: pointer;
    }

    ${UI.Icon} svg path {
      stroke: currentColor;
    }
  `}
`;

export const WorkspaceSwitcher = () => {
  const { user } = useUser();
  const { activeCustomer } = useCustomer();

  return (
    <WorkspaceSwitcherContainer>
      <UI.Flex alignItems="center" justifyContent="space-between">
        <UI.Flex alignItems="center">
          <UI.Div>
            <Avatar
              name={user?.firstName || 'N'}
              brand="main"
            />
          </UI.Div>
          <UI.Div ml={2}>
            <UI.Strong color="off.600">
              {user?.firstName}
            </UI.Strong>
            <UI.Muted>
              {activeCustomer?.name}
            </UI.Muted>
          </UI.Div>
        </UI.Flex>

        <UI.Div>
          <UI.Icon fontSize="0.2rem" color="off.500">
            <SwitchIcon width="1rem" />
          </UI.Icon>
        </UI.Div>
      </UI.Flex>
    </WorkspaceSwitcherContainer>
  );
};
