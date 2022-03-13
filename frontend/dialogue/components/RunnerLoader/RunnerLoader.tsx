import Lottie from 'react-lottie';
import styled, { css } from 'styled-components';

import HAASRun from '../SliderNode/lottie-rabbit-run.json';

interface RunnerLoaderProps {
  color?: string;
}

const RunnerLoaderContainer = styled.div<RunnerLoaderProps>`
  ${({ color }) => css`
    svg path {
      fill: ${color};
    }
  `}
`;

/**
 * RunnerLoader shows a running hare as a loading indicator.
 */
export const RunnerLoader = ({ color = '#fff' }: RunnerLoaderProps) => (
  <RunnerLoaderContainer color={color}>
    <Lottie
      options={{
        animationData: HAASRun,
        loop: true,
      }}
      width={200}
      speed={1.0}
    />
  </RunnerLoaderContainer>
);
