import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as SwitchIcon } from 'assets/icons/icon-switch.svg';

const WorkspaceSwitcherContainer = styled(UI.Div)`
  ${({ theme }) => css`
    background: ${theme.colors.neutral[100]};
    padding: ${theme.gutter / 2}px;
    border-radius: ${theme.borderRadiuses.md}px;
    border: 1px solid ${theme.colors.neutral[500]};
    box-shadow: ${theme.boxShadows.md};
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      cursor: pointer;
      box-shadow: ${theme.boxShadows.lg};
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    color: ${theme.colors.gray[500]};
    font-weight: 700;

    ${UI.Icon} {
      width: 23px;
      height: 23px;
      object-fit: contain;
      display: flex;


      svg {
        width: 100%;
      }

      svg, svg path {
        stroke: ${theme.colors.gray[400]};
      }
    }
  `}
`;

export const WorkspaceSwitcher = () => {
  const { t } = useTranslation();
  return (
    <WorkspaceSwitcherContainer>
      <UI.Flex alignItems="center">
        <UI.Div>
          Jonathan Mitnik
          <UI.Muted>
            haas Inc
          </UI.Muted>
        </UI.Div>
      </UI.Flex>
    </WorkspaceSwitcherContainer>
  );
};
