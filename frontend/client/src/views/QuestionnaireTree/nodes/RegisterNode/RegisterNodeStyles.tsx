import styled, { css } from 'styled-components/macro';
import { ActiveNodeContainer } from '../NodeStyles';

export const RegisterNodeContainer = styled(ActiveNodeContainer)`
  ${({ theme }) => css`
    height: 100%;

    input {
      border-radius: 30px;
      border: 1px solid ${theme.colors.primary};
      font-size: ${theme.fontSizes[1]}px;
      width: 100%;
      resize: none;
    }
  `}
`;
