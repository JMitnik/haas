import React from 'react';
import styled from 'styled-components/macro';

interface WatermarkLogoProps {
  logoUrl: string;
}

const WatermarkLogoContainer = styled.div`
  position: absolute;
  width: 175px;
  height: 175px;

  /* TODO: Put positioning smarter */
  top: 50%;
  transform: translateY(-50%);

  img {
    opacity: 0.15;
    z-index: 0;
    max-width: 100%;
  }
`;

const WatermarkLogo = ({ logoUrl }: WatermarkLogoProps) => (
  <WatermarkLogoContainer>
    <img src={logoUrl} alt="Watermark logo" />
  </WatermarkLogoContainer>
);

export default WatermarkLogo;
