import React from 'react';
import styled, { css } from 'styled-components';

import { Div, GenericProps, H2 } from '@haas/ui';
import { ReactComponent as SVGLogo } from 'assets/logo.svg';
import { ReactComponent as SVGLogoText } from 'assets/icons/logo-text.svg';
import { ReactComponent as SVGLogoThumbnail } from 'assets/images/logo-thumbnail.svg';

export const LogoIconContainer = styled(Div) <{ fill?: string }>`
  ${({ theme }) => css`
    display: flex;

    ${theme && css`
      svg path {
        fill: currentColor;
      }
    `}

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

export const LogoIcon = (props: any) => (
  <LogoIconContainer {...props}>
    <SVGLogo />
  </LogoIconContainer>
);

export const LogoContainer = styled(Div)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-weight: 900;
    font-size: 1.5rem;

    svg {
      width: 100%;
      height: 100%;
    }

    ${theme && css`
      svg path {
        fill: currentColor;
      }
    `}

    img {
      max-width: 100%;
    }
  `}
`;

export const Logo = (props: any) => (
  <LogoContainer {...props}>
    <SVGLogoText />
    {/* <LogoIcon width="60px" height="60px" justifyContent="center" />
    <UI.Text>haas</UI.Text> */}
  </LogoContainer>
);

export const FilledLogo = (props: any) => (
  <FilledLogoContainer {...props}>
    <SVGLogo />
  </FilledLogoContainer>
);

export const LogoThumbnail = (props: any) => (
  <SVGLogoThumbnail {...props} />
);

export default LogoIcon;
