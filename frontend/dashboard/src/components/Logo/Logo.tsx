import React from 'react';
import styled, { css } from 'styled-components';

import { Div, GenericProps, H2 } from '@haas/ui';
import { ReactComponent as SVGLogo } from 'assets/logo.svg';

export const LogoContainer = styled(Div) <{ fill?: string }>`
  ${({ theme }) => css`
    display: flex;

    ${theme && css`
      svg path {
        fill: currentColor;
      }
    `}

    /* Manual size */
    /* width: 60px; */

    img {
      max-width: 100%;
    }
  `}
`;

export const FilledLogoContainer = styled(Div) <{ fill?: string }>`
  ${({ theme }) => css`
    display: flex;
    background: ${theme.colors.primary};
    border-radius: 15px;
    padding: 0px;
    align-items: center;

    ${theme && css`
      svg {
        height: auto;
      }

      svg path {
        fill: white;
      }
    `}

    /* Manual size */
    /* width: 60px; */

    img {
      max-width: 100%;
    }
  `}
`;

export const FullLogoContainer = styled(Div) <GenericProps>`
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

export const FullLogo = (props: any) => (
  <FullLogoContainer {...props}>
    <SVGLogo />
    <H2>haas</H2>
  </FullLogoContainer>
);

export const Logo = (props: any) => (
  <LogoContainer {...props}>
    <SVGLogo />
  </LogoContainer>
);

export const FilledLogo = (props: any) => (
  <FilledLogoContainer {...props}>
    <SVGLogo />
  </FilledLogoContainer>
);

export default Logo;
