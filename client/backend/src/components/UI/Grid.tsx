import styled, { css } from 'styled-components';

export const Grid = styled.div`
  ${({ theme }) => css`
    display: grid;
    padding: ${theme.gutter}px;
    grid-template-columns: 100%;
    grid-row-gap: 5px;
    `
}`;
