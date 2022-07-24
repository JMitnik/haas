import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import React from 'react';
import styled, { css } from 'styled-components';

import HAASRun from 'assets/animations/lottie-rabbit-run.json';

const LoaderContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
    width: 100px;
    height: 100px;

    svg path {
      fill: ${theme.colors.gray[500]};
    }

    svg {
      cursor: auto;
      max-width: 100%;
    }
  `}
`;

export const Loader = ({ testId = 'load' }: { testId: string }) => (
  <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
    <LoaderContainer data-testid={testId}>
      <Lottie
        options={{
          animationData: HAASRun,
          loop: true,
        }}
        isClickToPauseDisabled
        speed={1}
      />
    </LoaderContainer>
  </motion.div>
);
