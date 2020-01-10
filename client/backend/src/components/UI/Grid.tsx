import styled, { css } from 'styled-components';

export const Grid = styled.div`
  ${({ theme }) => css`
    display: grid;
    padding: ${theme.gutter}px;
    /* justify-content: center; */
    grid-template-columns: 50% 50%;
    /* grid-template-rows: 100px 100px 100px; */
    grid-row-gap: 1px;
    /* grid-auto-rows: 100%; */
    background: #EBEEFF;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

    `
}`;
