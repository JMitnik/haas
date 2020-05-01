import styled, { css } from 'styled-components/macro';
import { H2, H3 } from '@haas/ui';
import Color from 'color';
import { ActiveNodeContainer } from '../Node/NodeStyles';
import { motion } from 'framer-motion';

export const SliderNodeContainer = styled(ActiveNodeContainer)`
  height: 100%;
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
