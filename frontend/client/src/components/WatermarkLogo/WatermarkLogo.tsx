import React from 'react';
import styled, { css } from 'styled-components';

interface WatermarkLogoProps {
  logoUrl: string;
  opacity?: number;
}

const WatermarkLogoContainer = styled.div<{ opacity?: number; }>`
  ${({ opacity }) => css`
    position: absolute;
    width: 175px;
    height: 175px;

    /* TODO: Put positioning smarter */
    top: 50%;
    transform: translateY(-50%);

    img {
      opacity: ${(opacity !== undefined && opacity !== null) ? (opacity / 100) : 0.3};
      z-index: 0;
      max-width: 100%;
    }
  `}
`;

const WatermarkLogo = ({ logoUrl, opacity }: WatermarkLogoProps) => (
  <WatermarkLogoContainer opacity={opacity}>
    <img src={logoUrl} alt="Watermark logo" />
  </WatermarkLogoContainer>
);

export default WatermarkLogo;
