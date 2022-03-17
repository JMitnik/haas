import { motion } from 'framer-motion';
import Color from 'color';
import styled, { css } from 'styled-components';
import { Div } from '@haas/ui';

export const SliderNodeContainer = styled(Div)``;

export const SlideHereContainer = styled(motion.div)`
  ${({ theme }) => css`
    display: flex;
    top: -${theme.gutter}px;
    width: 100%;
    color: ${Color(theme.colors._primary).mix(Color('white'), 0.6).hex()};
    opacity: 0;
    font-family: 'Inter', sans-serif;
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

      path {
        stroke: ${theme.colors.primary['100']};
      }
    }
  `}
`;

export const SliderNodeValue = styled(motion.span)`
  ${({ theme }) => css`
    background: rgba(255, 255, 255, 0.4);
    color: ${theme.colors._primary};
    text-align: center;
    font-size: 1.1rem;
    font-weight: 1000;
    position: relative;
    border-radius: 30px;
    display: flex;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    overflow: hidden;
    width: 45px;
    height: 45px;
    margin-right: ${theme.gutter / 2}px;

    > svg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      fill: none;
    }

    > span {
      opacity: 1;
      background: white;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      .signal {
        width: 100%;
        height: 100%;
        border-radius: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          stroke: currentColor;
          width: 80%;
          height: 80%;
        }
      }
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

interface SliderSpeechWrapperProps {
  isOpen?: boolean;
}

export const SliderSpeechWrapper = styled(Div)<SliderSpeechWrapperProps>`
  ${({ theme, isOpen }) => css`
    border-radius: 20px;
    backdrop-filter: blur(5px);
    opacity: 0;

    ${isOpen && css`
      opacity: 1;
      box-shadow: 0px 0px 0px 1px rgba(255,255, 255, 0.15);
    `}

    ${theme.brightMode === 'light' && css`
      background: rgba(255, 255, 255, 0.5);
      border: red;
    `}

    ${theme.brightMode === 'medium' && css`
      background: rgba(255, 255, 255, 0.3);
    `}

    ${theme.brightMode === 'dark' && css`
      background: rgba(0, 0, 0, 0.3);
    `}
  `}
`;

export const InnerSpeechWrapper = styled(Div)`
  box-shadow: inset 0px 2px 3px rgba(255,255, 255, 0.06) !important;
  display: flex;
  align-items: center;
  border-radius: 20px;
  width: 100%;

  > div {
      width: 100%;
      display: flex;
      align-items: center;

      border-radius: 20px;
      padding: 12px;

      &:hover {
        cursor: pointer;
      }
    }
`;

export const PseudoSliderTrack = styled.div`
  ${({ theme }) => css`
    width: 100%;
    border-radius: 10px;
    background: ${theme.colors.primary['300']};
    box-shadow: rgba(0, 0, 0, 0.08) 0 4px 12px;
  `}
`;
