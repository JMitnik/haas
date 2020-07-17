/* eslint-disable max-len */
import React from 'react';

import styled, { css } from 'styled-components/macro';

const Svg = styled.svg <{isCTA?: Boolean, hasCTA?: Boolean}>`
  ${({ hasCTA, isCTA, theme }) => css`
    color: ${theme.colors.default.darkest};
  
    path {
      ${!isCTA && css`
        fill: white;
      `}
      ${!hasCTA && css`
        fill: ${theme.colors.default.darkest};
        opacity: 0.4;
      `}
      ${hasCTA && css`
        fill: ${theme.colors.default.darkest};
        opacity: 1;
      `}
    }
  `}
`;

const RegisterIcon = ({ isCTA, hasCTA } : { isCTA?: Boolean, hasCTA?: Boolean }) => (
  <Svg isCTA={isCTA} hasCTA={hasCTA} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C10.6739 12 9.40215 11.4732 8.46447 10.5355C7.52678 9.59785 7 8.32608 7 7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7C17 8.32608 16.4732 9.59785 15.5355 10.5355C14.5979 11.4732 13.3261 12 12 12Z" />
    <path d="M21 20V19C21 17.6739 20.4732 16.4021 19.5355 15.4645C18.5979 14.5268 17.3261 14 16 14H8C6.67392 14 5.40215 14.5268 4.46447 15.4645C3.52678 16.4021 3 17.6739 3 19V20C3 21.1 3.9 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20Z" />
  </Svg>
);

export default RegisterIcon;
