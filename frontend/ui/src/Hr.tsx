import styled, { css } from 'styled-components/macro';

export const Hr = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.default.light};
  `}
`;