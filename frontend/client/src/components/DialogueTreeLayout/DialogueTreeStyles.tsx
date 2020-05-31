import Color from 'color';

import { Container, Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const DialogueContainer = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.primary};
    background: linear-gradient(45deg, ${Color(theme.colors.primary).darken(0.1).hex()}, ${Color(theme.colors.primary).lighten(0.4).hex()});
    padding: 5vh ${theme.gutter}px;
    margin: 0 auto;
    display: flex;
    width: 100%;
    min-height: calc(var(--vh, 1vh) * 100);
    justify-content: center;
    align-items: stretch;

    > ${Container} {
      z-index: 1;
    }

    ${theme.colors.primary
      && theme.colors.primaryAlt
      && css`
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

export const GoBackButton = styled(Div)`
  ${({ theme }) => css`
    border-radius: 100%;
    box-shadow: 1px;
    position: absolute;
    top: ${theme.gutter}px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.10);
    left: ${theme.gutter}px;

    color: white;

    i, svg {
      width: 25px;
      line-height: 25px;
      height: 25px;
      font-size: 2em;
    }
  `}
`;
