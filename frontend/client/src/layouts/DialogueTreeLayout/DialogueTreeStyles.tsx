import Color from 'color';

import { Container, Div } from '@haas/ui';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components/macro';

export const DialogueTreeContainer = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.primary};
    background: linear-gradient(45deg, ${Color(theme.colors.primary).darken(0.1).hex()}, ${Color(theme.colors.primary).lighten(0.4).hex()});
    padding: 5vh ${theme.gutter}px;
    margin: 0 auto;
    display: flex;
    overflow: hidden;
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

export const GoBackText = styled.span`
  opacity: 0;
  font-size: 0.8rem;
  color: white;
  transition: all .3s cubic-bezier(.55,0,.1,1);
`;

export const GoBackContainer = styled(motion.div)`
  ${({ theme }) => css`
    position: absolute;
    top: 50vh;
    left: 0;

    @media ${theme.media.mob} {
      top: ${theme.gutter}px;
      left: ${theme.gutter}px;
      }

    p, span {
      position: absolute;
      bottom: 0;
      transform: translateX(-100%);
      left: 0;
      opacity: 0;
      width: 100px;
      display: inline-block;
      padding-top: ${theme.gutter / 2}px;
    }

    &:hover {
      ${GoBackText} {
        opacity: 1;
        transform: translateX(8px);
        transition: all .3s cubic-bezier(.55,0,.1,1);
      }
    }
  `}
`;

export const GoBackButton = styled.button`
  ${({ theme }) => css`
    cursor: pointer;
    background: transparent;
    border-radius: 100%;
    box-shadow: 1px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
    height: 30px;
    background-color: ${Color(theme.colors.primary).mix(Color('white'), 0.4).hex()};
    box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, 0.10);
    color: white;
    transition: all .3s cubic-bezier(.55,0,.1,1);

    @media ${theme.media.desk} {
      width: 30px;
    }

    @media ${theme.media.desk} {
      width: 50px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      padding: 40px 0;
      transform: translateY(-50%);
    }

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      transition: all .3s cubic-bezier(.55,0,.1,1);
    }

    i, svg {
      position: absolute;
      width: 25px;
      line-height: 25px;
      height: 25px;
      font-size: 2em;
    }
  `}
`;
