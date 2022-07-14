import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { Logo, LogoContainer } from 'components/Logo';
import { useCustomer } from 'providers/CustomerProvider';
import useMediaDevice from 'hooks/useMediaDevice';

import * as LS from './WorkpaceLayout.styles';
import { TopbarHamburger } from './TopbarHamburger';
import { WorkspaceNav } from './WorkspaceNav';
import { WorkspaceSwitcher, WorkspaceSwitcherContainer } from './WorkspaceSwitcher';

interface TopbarContainerProps {
  maxHeight?: number;
}

export const TopbarContainer = styled(UI.Div)<TopbarContainerProps>`
  ${({ theme, maxHeight = 60 }) => css`
    padding: 0;
    background: ${theme.colors.app.topbar};
    border-bottom: 1px solid ${theme.colors.gray[100]};
    width: 100%;

    ${maxHeight && css`
      max-height: ${maxHeight}px;
    `}

    ${LogoContainer} {
      color: ${theme.colors.off[600]};

      ${maxHeight && css`
        max-height: ${maxHeight}px;
      `}
    }


    ${LogoContainer} {
      color: ${theme.colors.off[500]};
      padding: ${theme.gutter}px;
      width: 170px;
    }

    ${LS.NavItems} {
      display: flex;
    }

    /* Sidenav list */
    ${LS.NavItems} ul {
      display: flex;
      grid-gap: ${theme.gutter / 4}px;
      margin-right: ${theme.gutter / 4}px;
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

        .chevron-down {
          fill: none;
        }
      }

      &:hover {
        color: ${theme.colors.main[600]};
        transition: color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

        svg {
          transition: color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          fill: ${theme.colors.main[600]};
        }

        .chevron-down {
          fill: none !important;
        }
      }
    }

    ${LS.SubNav} {
      display: none !important;
      position: absolute;
      z-index: 100000;
      background: white;
      min-width: 300px;
      border-radius: ${theme.borderRadiuses.md}px;
      box-shadow: ${theme.boxShadows.md};
      padding: ${theme.gutter}px;
    }

    li:hover ${LS.SubNav} {
      display: block !important;
    }

    .hamburger {
      ${LS.SubNav} {
        display: block !important;
        position: relative;
      }

      ${LS.NavItems} {
        display: block;
      }


      [data-radix-popper-content-wrapper] {
        width: 60%;
      }

      ${UI.Hr} {
        display: block;
      }

      ${LS.NavItems} ul {
        display: block !important;
        list-style: none;
        border-radius: 0;
        padding: 4px 0;
        box-shadow: none;
      }
    }

    ${WorkspaceSwitcherContainer} {
      p {
        max-width: 175px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      ${maxHeight && css`
        max-height: ${maxHeight}px;
        padding: 0 ${theme.gutter}px;
        border-radius: ${theme.borderRadiuses.sm}px;
        border-top: none;
        border-right: none;
      `}
    }

    ${WorkspaceSwitcherContainer} ${UI.Icon} {
      margin-left: ${theme.gutter}px;
    }
  `}
`;

interface WorkspaceTopbarProps {
  withNav?: boolean;
}

const WorkspaceTopbar = ({ withNav }: WorkspaceTopbarProps) => {
  const { activeCustomer } = useCustomer();

  const { isSmall, isMedium } = useMediaDevice();
  return (
    <TopbarContainer maxHeight={60}>
      <UI.Container>
        <UI.Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <UI.Div flexShrink={0}>
            <Logo />
          </UI.Div>

          {withNav && (
            <UI.Flex alignItems="center">
              {(isSmall || isMedium) ? (
                <TopbarHamburger />
              ) : (
                <>
                  <WorkspaceNav customerSlug={activeCustomer?.slug || ''} />
                  <WorkspaceSwitcher />
                </>
              )}
            </UI.Flex>
          )}
        </UI.Flex>
      </UI.Container>
    </TopbarContainer>
  );
};

export { WorkspaceTopbar };
