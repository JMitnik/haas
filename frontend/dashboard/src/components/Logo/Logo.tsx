import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, GenericProps, H2 } from '@haas/ui';
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
    /* width: 60px; */

    img {
      max-width: 100%;
    }
  `}
`;

export const FullLogoContainer = styled(Div)<GenericProps>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    ${H2} {
      margin-left: ${theme.gutter / 2}px;
      font-weight: 700;
      color: inherit;
    }

    svg {
      fill: currentColor;
    }

    svg path {
      fill: currentColor;
    }
  `}
`;

interface LogoProps {
  isWithTitle?: boolean;
  isWithSubtitle?: boolean;
  fill?: string;
}

export const FullLogo = (props: any) => (
  <FullLogoContainer {...props}>
    <SVGLogo />
    <H2>haas</H2>
  </FullLogoContainer>
);

const Logo = () => (
  <LogoContainer>
    <SVGLogo />
  </LogoContainer>
);

export default Logo;
