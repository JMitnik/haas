import React from 'react';
import styled from 'styled-components/macro';

export const LogoContainer = styled.a`
  display: block;
  filter: grayscale(100%) brightness(70%) contrast(2);

  /* Manual size */
  width: 60px;

  img {
    max-width: 100%;
  }
`;

const Logo = () => (
  <LogoContainer>
    <img src="/logo.svg" alt="HAAS Logo" />
  </LogoContainer>
);

export default Logo;
