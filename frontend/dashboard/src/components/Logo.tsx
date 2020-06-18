import React from 'react';
import styled from 'styled-components/macro';

import { ReactComponent as SVGLogo } from 'assets/logo.svg';

export const LogoContainer = styled.div`
  display: block;

  /* Manual size */
  width: 60px;
  margin: 0 auto;

  img {
    max-width: 100%;
  }
`;

const Logo = () => (
  <LogoContainer>
    <SVGLogo />
  </LogoContainer>
);

export default Logo;
