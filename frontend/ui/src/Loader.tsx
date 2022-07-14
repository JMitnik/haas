import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { Div } from './Generics';

const LOADER_SIZE = 24;

interface LoaderContainerProps {
  brand?: string;
}

const LoaderContainer = styled.div<LoaderContainerProps>`
  ${({ theme, brand = 'off.500' }) => css`
    .spinner {
      width: ${LOADER_SIZE}px;
      height: ${LOADER_SIZE}px;
      position: relative;
    }

    .double-bounce1, .double-bounce2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: white;
      background-color: ${get(theme.colors, brand)};
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;

      -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
      animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }

    @-webkit-keyframes sk-bounce {
      0%, 100% { -webkit-transform: scale(0.0) }
      50% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bounce {
      0%, 100% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
      } 50% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
      }
    }
  `}
`;

interface LoaderProps {
  brand?: string;
}

export const Loader = ({ brand = 'off.500' } : LoaderProps) => (
  <LoaderContainer className="loader" brand={brand}>
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  </LoaderContainer>
)

export const LoaderSlot = styled(Div)`
  width: ${LOADER_SIZE}px;
  height: ${LOADER_SIZE}px;
`;

export default Loader;
