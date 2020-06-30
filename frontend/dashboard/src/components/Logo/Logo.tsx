import React from 'react';
import styled, { css } from 'styled-components/macro';

import { ReactComponent as SVGLogo } from 'assets/logo.svg';

export const LogoContainer = styled.div<{fill?: string}>`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;

    ${theme && css`
      svg path {
        fill: ${theme.colors.primary};
      }
    `}

    /* Manual size */
    width: 60px;

    img {
      max-width: 100%;
    }
  `}
`;

interface LogoProps {
  isWithTitle?: boolean;
  isWithSubtitle?: boolean;
  fill?: string;
}

const Logo = () => (
  <LogoContainer>
    <SVGLogo />
  </LogoContainer>
);

export default Logo;
