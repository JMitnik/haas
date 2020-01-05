import styled, { css } from 'styled-components';

export const Button = styled.button`
    ${({ theme }) => css`
        background: ${theme.colors.primaryColor};
        padding: ${theme.buttonSizes.sm}
    `}
`;
