import { HAASRun } from 'assets/animations';
import Lottie from 'react-lottie';
import React from 'react';
import styled from 'styled-components/macro';

const LoaderContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;

    svg {
        max-width: 250px;
    }
`;

const Loader = () => (
  <LoaderContainer>
    <Lottie
      options={{
        animationData: HAASRun,
        loop: true,
      }}
      speed={1}
    />
  </LoaderContainer>
);

export default Loader;
