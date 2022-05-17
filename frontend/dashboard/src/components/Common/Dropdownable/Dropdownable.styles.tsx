/**
 * Each dropdown-able component should extend these styles.
 *
 * Components:
 * - Popover
 * - Dropdown
 * - Menu
 */
import * as UI from '@haas/ui';
import { css } from 'styled-components';

/**
 * Each dropdownable item component should extend this.
 */
export const ItemStyles = css`
  ${({ theme }) => css`
    display: block;
    background: white;
    color: ${theme.colors.gray[600]};
    font-size: 1rem;
    font-weight: 500;
    border-radius: ${theme.borderRadiuses.md}px;
    padding: 4px 8px;
    transition: all ${theme.transitions.normal};

    &:hover, &:focus {
      color: ${theme.colors.main[500]};
      outline: none;
      transition: all ${theme.transitions.normal};
    }

    & + & {
      margin-top: 2px;
    }

    &:focus, &:hover {
      cursor: pointer;
      background: ${theme.colors.gray[100]};
      transition: all ${theme.transitions.normal};
    }

    ${UI.Icon} {
      width: 18px;
      margin-right: ${theme.gutter / 2}px;
    }
    ${UI.Icon} svg {
      max-width: 100%;
    }
  `}
`;

/**
 * Each menu item
 */
export const MenuItemStyles = css`
  ${({ theme }) => css`
    ${ItemStyles}
    display: block;

    & + * {
      margin-top: 2px;
    }

    &:hover {
      color: ${theme.colors.main[500]};
      transition: all ${theme.transitions.normal};
    }
  `}
`;

export const NavItemStyles = css`
  ${({ theme }) => css`
    ${ItemStyles}
    display: block !important;

    &:hover {
      color: ${theme.colors.main[500]};
      transition: all ${theme.transitions.normal};
    }
  `}
`;

export const LabelStyles = css`
  ${({ theme }) => css`
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.neutral[700]};
    margin-bottom: 4px;
    padding-left: ${theme.gutter / 3}px;
  `}
`;
