import * as UI from '@haas/ui';
import { useParams } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components';

import { Logo } from 'components/Logo';
import { LogoContainer } from 'components/Logo/Logo';

import * as LS from './WorkpaceLayout.styles';
import { NavLinkContainer, WorkspaceNav } from './WorkspaceNav';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const SidenavContainer = styled.div`
  ${({ theme }) => css`
    position: fixed;
    z-index: 1200;
    display: flex;
    box-shadow: inset 1px 0px 4px rgb(0 0 0 / 20%);
    flex-direction: column;

    width: ${theme.sidenav.width}px;
    padding: ${theme.gutter}px;
    height: 100%;

    background: ${theme.colors.app.sidebar};

    ${LogoContainer} {
      color: ${theme.colors.gray[600]};
      /* color: ${theme.colors.strongPrimary}; */
    }

    /* Sidenav list container */
    ${LS.NavItems} {
      margin-top: ${theme.gutter / 2}px;
    }

    /* Sidenav list */
    ${LS.NavItems} ul {
      display: grid;
      grid-gap: ${theme.gutter / 4}px;
      list-style: none;
    }

    /* The actual link items */
    ${NavLinkContainer} {
      color: ${theme.colors.gray[600]};
      padding: 4px 11px;
      font-size: 0.8rem;
      font-weight: 700;

      /* For the icons */
      svg {
        margin-right: ${theme.gutter / 2}px;
        width: 21px;
        fill: ${theme.colors.gray[500]};

        .secondary {
          fill: ${theme.colors.gray[400]};
        }
      }

      /* If the link is active (according to react-router) */
      &.active {
        /* background: ${theme.colors.primaryGradient}; */
        background: linear-gradient(298.18deg, #4C5ABB 0.84%, rgba(96, 111, 219, 0.8) 100%);
        border-radius: ${theme.borderRadiuses.somewhatRounded};
        color: white;

        .secondary {
          fill: ${theme.colors.main[200]};
        }

        svg {
          fill: white;
        }
      }

      &:hover {
        color: ${theme.colors.main[600]};

        svg {
          fill: ${theme.colors.gray[600]};
        }
        /* color: ${theme.isDarkColor ? theme.colors.primaries['200'] : theme.colors.primaries['700']}; */
      }
    }

    // Remove Side-nav when printing
    @media print {
      border-right: none;
    }
  `}
`;

export const WorkspaceSidenav = () => {
  const params: { customerSlug: string } = useParams<any>();

  return (
    <SidenavContainer data-cy="Sidenav">
      <UI.ColumnFlex justifyContent="space-between" height="100%">
        <UI.Div>
          <Logo />
          <WorkspaceNav customerSlug={params.customerSlug} />
        </UI.Div>

        <UI.Div>
          <WorkspaceSwitcher />
        </UI.Div>
      </UI.ColumnFlex>
    </SidenavContainer>
  );
};
