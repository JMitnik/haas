import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

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

export const LoginContentContainer = styled(Div)`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

export const LoginViewContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.gray[100]};
    min-height: 100vh;
  `}
`;

export const LoginViewSideScreen = styled(Div)`
    background-image: radial-gradient(circle at 29% 55%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 4%,transparent 4%, transparent 44%,transparent 44%, transparent 100%),radial-gradient(circle at 85% 89%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 51%,transparent 51%, transparent 52%,transparent 52%, transparent 100%),radial-gradient(circle at 6% 90%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 53%,transparent 53%, transparent 64%,transparent 64%, transparent 100%),radial-gradient(circle at 35% 75%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 6%,transparent 6%, transparent 98%,transparent 98%, transparent 100%),radial-gradient(circle at 56% 75%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 16%,transparent 16%, transparent 23%,transparent 23%, transparent 100%),radial-gradient(circle at 42% 0%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 3%,transparent 3%, transparent 26%,transparent 26%, transparent 100%),radial-gradient(circle at 29% 28%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 51%,transparent 51%, transparent 75%,transparent 75%, transparent 100%),radial-gradient(circle at 77% 21%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 35%,transparent 35%, transparent 55%,transparent 55%, transparent 100%),radial-gradient(circle at 65% 91%, hsla(329,0%,99%,0.05) 0%, hsla(329,0%,99%,0.05) 46%,transparent 46%, transparent 76%,transparent 76%, transparent 100%),linear-gradient(45deg, rgb(83, 91, 235),rgb(76, 11, 174));
`;
