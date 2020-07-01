import { motion } from 'framer-motion';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

import { Div } from '@haas/ui';

export const SliderNodeContainer = styled(Div)``;

export const SlideHereContainer = styled(motion.div)`
  ${({ theme }) => css`
    color: ${Color(theme.colors.primary).mix(Color('black'), 0.4).hex()};
    opacity: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.8rem;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
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

  svg {
    /* TODO: Find out why important is so important */
    width: auto !important;
    height: auto !important;
    max-width: 200px;
    background: transparent;
    border: none;
  }
`;
