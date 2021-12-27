import React from 'react';
import styled, { css } from 'styled-components';

interface LogoContainerProps {
  logoWidth: number;
}

const LogoContainer = styled.a<LogoContainerProps>`
  ${({ logoWidth, theme }) => css`
    img {
      width: ${logoWidth}px;

      @media ${theme.media.mob} {
        width: 80px;
      }
    }
  `}
`;

const Logo = ({ width }: { width: number }) => (
  <LogoContainer logoWidth={width}>
    <img src="./logo-haas.svg" alt="Logo HAAS" />
  </LogoContainer>
);

export default Logo;
