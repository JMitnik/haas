import styled, { css } from 'styled-components';

export const Flex = styled.div`
  ${({ theme }) => css`
    display: flex;
    padding: ${theme.gutter}px;
    /* justify-content: center; */
    align-items: center;
    `
}`;
