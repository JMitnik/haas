import React from 'react';
import styled, { css } from 'styled-components/macro';

export const MenuItem = styled.li`
  padding: 6px 8px;
  font-size: bold;
  font-size: 0.9rem;
`;

export const MenuHeader = styled.li`
  ${({ theme }) => css`
    color: ${theme.colors.app.mutedOnWhite};
    padding: 6px 8px;
    font-size: 0.7rem;
    font-weight: bold;
  `}
`;

export const Menu = styled.ul`
  list-style: none;
`;

export default Menu;
