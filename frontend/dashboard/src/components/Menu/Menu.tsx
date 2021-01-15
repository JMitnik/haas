import styled, { css } from 'styled-components';

export const MenuItem = styled.li`
  ${({ theme }) => css`
    padding: 12px 16px;
    font-size: bold;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    color: ${theme.colors.app.mutedAltOnWhite};

    &:hover {
      transition: all .3s cubic-bezier(.55,0,.1,1);
      background: ${theme.colors.default.normalAlt};
    }

    svg {
      color: ${theme.colors.app.mutedOnWhite};
      max-width: 13px;
      stroke: currentColor;
      margin-right: 6px;
    }
  `}
`;

export const MenuHeader = styled.li`
  ${({ theme }) => css`
    color: ${theme.colors.app.mutedOnWhite};
    padding: 12px 16px;
    font-size: 0.7rem;
    border-bottom: 1px solid ${theme.colors.default.normalAlt};
    font-weight: bold;
  `}
`;

export const Menu = styled.ul`
  ${({ theme }) => css`
    list-style: none;
    min-width: 120px;
    padding-bottom: ${theme.gutter / 2}px;
  `}
`;

export default Menu;
