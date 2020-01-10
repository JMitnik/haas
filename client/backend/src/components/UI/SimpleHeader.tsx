import styled, { css } from 'styled-components';

export const SimpleHeader = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    width: fill;
    padding: ${theme.gutter}px;
    `
}`;
