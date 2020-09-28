import { motion } from 'framer-motion';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

import { Div } from '@haas/ui';

export const SliderNodeContainer = styled(Div)``;

export const SlideHereContainer = styled(motion.div)`
  ${({ theme }) => css`
    display: flex;
    top: -${theme.gutter}px;
    width: 100%;
    color: ${Color(theme.colors.primary).mix(Color('white'), 0.6).hex()};
    opacity: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    justify-content: space-between;
    overflow: hidden;
    flex-wrap: wrap;
    align-items: center;

    i {
      margin-left: 4px;
    }

    svg {
      width: 16px;
      height: 16px;
      margin-right: ${theme.gutter / 4}px;
    }
  `}
`;

export const FingerPrintContainer = styled(motion.div)`
  ${({ theme }) => css`
    position: absolute; 
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    min-height: 48px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: fit-content;

    svg {
      width: 36px;
      height: 36px;
      > g {
        stroke-width: 1;
        stroke: ${Color(theme.colors.primary).mix(Color('white'), 0.9).hex()};;
      }
    }
  `}
`;

export const SliderNodeValue = styled(motion.h3)`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    display: inline-block;
    text-align: center;
    font-size: 1.5rem;
    width: 75px;
    height: 75px;
    margin: 100px auto;
    margin-top: ${theme.gutter}px;
    font-weight: 1000;
    position: relative;

    p {
      opacity: 1;
      width: 100%;
      height: 100%;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
      background: white;
      border: 4px solid white;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}
`;

export const HAASRabbit = styled.div`
  position: absolute;
  transform: translateX(-50%);

  .rabbit svg {
    /* TODO: Find out why important is so important */
    width: auto !important;
    height: auto !important;
    max-width: 200px;
    background: transparent;
    border: none;
  }
`;
