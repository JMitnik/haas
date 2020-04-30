import React from 'react';
import styled from 'styled-components/macro';

export const LogoContainer = styled.div`
  display: block;

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
