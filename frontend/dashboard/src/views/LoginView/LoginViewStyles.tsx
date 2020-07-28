import styled, { css } from 'styled-components/macro';

export const LoginBox = styled.div`
${({ theme }) => css`
    min-width: 300px;
    width: 600px;
    max-width: 100%;
    background: ${theme.colors.white};
    padding: ${theme.gutter}px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    border: 1px solid #fcfcfc;
    
    display: flex;
    align-items: center;
    justify-content: center;

  `}
`;

export const LoginViewContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.app.background};
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;
