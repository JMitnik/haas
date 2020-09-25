import { motion } from 'framer-motion';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

import { Div } from '@haas/ui';

export const SliderNodeContainer = styled(Div)``;

export const SlideHereContainer = styled(motion.div)`
  ${({ theme }) => css`
    display: flex;
    /* position: absolute; */
    top: -${theme.gutter}px;
    width: 100%;
    color: ${Color(theme.colors.primary).mix(Color('white'), 0.6).hex()};
    opacity: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    justify-content: space-between;
    /* left: 50%; */
    /* transform: translateX(-50%); */
    /* min-width: 200px; */
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
      fill: currentColor;
    }
  `}
`;

export const FingerPrintContainer = styled(motion.div)`
  ${({ theme }) => css`
    position: absolute; 
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    /* min-width: 150px;  */
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
    padding-bottom: 100px;
    text-align: center;
    font-size: 1.5rem;
    border-radius: 100%;
    width: 55px;
    background: ${Color(theme.colors.primary).mix(Color('white'), 0.9).hex()};
    height: 55px;
    margin: 100px auto;
    margin-top: ${theme.gutter}px;
    font-weight: 1000;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
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
