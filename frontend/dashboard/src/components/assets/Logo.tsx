import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.a`
    display: block;

    /* Manual size */
    max-width: 100%;
    width: 200px;

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
