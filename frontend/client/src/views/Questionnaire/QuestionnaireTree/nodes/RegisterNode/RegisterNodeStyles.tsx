import styled, { css } from 'styled-components/macro';

export const RegisterNodeContainer = styled.div`
  ${({ theme }) => css`
    input {
      border-radius: 30px;
      border: 1px solid ${theme.colors.primary};
      font-size: ${theme.fontSizes[1]}px;
      width: 100%;
      resize: none;
    }
  `}
`;
