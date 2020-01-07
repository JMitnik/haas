import styled, { css } from 'styled-components';

export const Button = styled.button`
    ${({ theme }) => css`
        background: ${theme.colors.primary};
        padding: ${theme.buttonSizes.sm}
    `}
`;
