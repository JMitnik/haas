import styled, { css } from 'styled-components';

export const GridForm = styled.form`
    ${({theme}) => css `
    display: grid;
    row-gap: 20px;
    column-gap: 10px;
    background: ${theme.defaultColors.alt};
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 10px;
    `    
}`