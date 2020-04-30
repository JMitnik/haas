import styled, { css } from 'styled-components/macro';
import Color from 'color';
import { Div, Container } from '@haas/ui';

export const DialogueContainer = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.primary};
    background: linear-gradient(45deg, ${Color(theme.colors.primary).darken(0.1).hex()}, ${Color(theme.colors.primary).lighten(0.4).hex()});
    padding: 5vh ${theme.gutter}px;
    margin: 0 auto;
    position: relative;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: stretch;

    > ${Container} {
      z-index: 1;
    }

    ${theme.colors.primary &&
      theme.colors.primaryAlt &&
      css`
        animation: BackgroundMove 30s ease infinite;
        background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryAlt});
        background-size: 200%;
      `}

    @-webkit-keyframes BackgroundMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @-moz-keyframes BackgroundMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes BackgroundMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `}
`;
