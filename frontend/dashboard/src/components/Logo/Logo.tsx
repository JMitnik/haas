import React from 'react';
import styled, { css } from 'styled-components/macro';

import { ReactComponent as SVGLogo } from 'assets/logo.svg';

export const LogoContainer = styled.div<{fill?: string}>`
  ${({ fill = '' }) => css`
    display: flex;
    justify-content: space-between;

    ${fill && css`
      svg path {
        fill: ${fill};
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

const Logo = ({ fill = '' }: LogoProps) => (
  <LogoContainer fill={fill}>
    <SVGLogo />
  </LogoContainer>
);

export default Logo;
