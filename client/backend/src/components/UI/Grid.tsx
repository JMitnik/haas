import styled, { css } from 'styled-components';

export const Grid = styled.div`
  ${({ theme }) => css`
    display: grid;
    padding: ${theme.gutter}px;
    /* justify-content: center; */
    grid-template-columns: 100%;
    /* grid-template-rows: 100px 100px 100px; */
    grid-row-gap: 5px;
    /* grid-auto-rows: 100%; */
    

    `
}`;
