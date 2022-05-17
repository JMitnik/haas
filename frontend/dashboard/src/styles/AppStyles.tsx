import styled, { css } from 'styled-components';

export const AppContainer = styled.div`
  ${({ theme }) => css`
    min-height: 100vh;
    background: ${theme.colors.white};
    margin: 0 auto;
  `}
`;

export const MainWindow = styled.div`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    background: ${theme.colors.default.lightest};
  `}
`;
