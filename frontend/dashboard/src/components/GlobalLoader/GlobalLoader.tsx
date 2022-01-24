import { HAASRun } from 'assets/animations';
import { motion } from 'framer-motion';
// import Lottie from 'react-lottie';
import React from 'react';
import styled, { css } from 'styled-components';

const GlobalLoaderContainer = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;

    svg path {
      fill: ${theme.colors.gray[500]};
    }

    svg {
      cursor: auto;
      max-width: 300px;
    }
  `}
`;

const GlobalLoader = () => (
  <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
    <GlobalLoaderContainer>
      {/* <Lottie
        options={{
          animationData: HAASRun,
          loop: true,
        }}
        isClickToPauseDisabled
        speed={1}
      /> */}
    </GlobalLoaderContainer>
  </motion.div>
);

export default GlobalLoader;
