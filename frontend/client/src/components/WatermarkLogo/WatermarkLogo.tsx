import React from "react";
import styled from "styled-components/macro";

interface WatermarkLogoProps {
  logoUrl: string;
}

const WatermarkLogoContainer = styled.div`
  position: absolute;
  width: 175px;
  height: 175px;

  /* Put positioning smarter */
  top: 50%;
  transform: translateY(-50%);

  opacity: 0.35;
  z-index: 0;

  img {
      max-width: 100%;
  }
`;

const WatermarkLogo = ({ logoUrl }: WatermarkLogoProps) => {
  return (
      <WatermarkLogoContainer>
          <img src={logoUrl} alt="Watermark logo" />
      </WatermarkLogoContainer>
  );
};

export default WatermarkLogo;
