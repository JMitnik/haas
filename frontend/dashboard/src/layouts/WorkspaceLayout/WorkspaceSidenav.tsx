import * as UI from '@haas/ui';
import { useParams } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components';

import { Logo } from 'components/Logo';
import { LogoContainer } from 'components/Logo/Logo';

import * as LS from './WorkpaceLayout.styles';
import { WorkspaceNav } from './WorkspaceNav';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const SidenavContainer = styled.div`
  ${({ theme }) => css`
    position: fixed;
    z-index: 1200;
    display: flex;
    box-shadow: inset 1px 0px 4px rgb(0 0 0 / 20%);
    flex-direction: column;

    width: ${theme.sidenav.width}px;
    /* padding: ${theme.gutter}px; */
    height: 100%;

    background: ${theme.colors.app.sidebar};

    ${LogoContainer} {
      color: ${theme.colors.gray[600]};
      padding: ${theme.gutter}px ${theme.gutter / 2}px;
    }

    /* Sidenav list container */
    ${LS.NavItems} {
    }

    /* Sidenav list */
    ${LS.NavItems} ul {
      display: grid;
      padding: 0 ${theme.gutter / 2}px;
      grid-gap: ${theme.gutter / 4}px;
      list-style: none;
    }

    ${UI.Hr} {
      margin: ${theme.gutter / 2}px 0;
      padding: 0;
    }

    /* The actual link items */
    ${LS.NavLinkContainer}, ${LS.SubNavItem} {
      color: #60708b; // TODO: Find a color in the palette for this
      padding: 6px 11px;
      font-size: 1rem;
      font-weight: 600;
      transition: color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

      /* For the icons */
      svg {
        transition: color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        margin-right: ${theme.gutter / 2}px;
        width: 22px;

        fill: #92a0b6; // TODO: Find a color in the palette for this
      }

      /* If the link is active (according to react-router) */
      &.active {
        background: linear-gradient(298.18deg, #4C5ABB 0.84%, rgba(96, 111, 219, 0.8) 100%);
        border-radius: ${theme.borderRadiuses.somewhatRounded};
        color: white;

        &:hover {
          color: white;

          svg {
            fill: white;
          }
        }

        svg {
          fill: white;
        }
      }

      &:hover {
        color: ${theme.colors.main[600]};
        transition: color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

        svg {
          transition: color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          fill: ${theme.colors.main[600]};
        }
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
