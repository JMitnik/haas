/* eslint-disable max-len */
import React from 'react';

import styled, { css } from 'styled-components';

const Svg = styled.svg <{isCTA?: Boolean, hasCTA?: Boolean}>`
  ${({ hasCTA, isCTA, theme }) => css`
    color: ${theme.colors.default.darkest};
  
    path {
      ${!isCTA && css`
        fill: white;
      `}
      ${(isCTA && !hasCTA) && css`
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

const OpinionIcon = ({ isCTA, hasCTA } : { isCTA?: Boolean, hasCTA?: Boolean }) => (
  <Svg isCTA={isCTA} hasCTA={hasCTA} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.0005 4.8L13.9205 11.6C13.9744 11.7264 14.0016 11.8626 14.0005 12V20C14.0005 20.5304 13.7898 21.0391 13.4147 21.4142C13.0396 21.7893 12.5309 22 12.0005 22H6.00049C5.21874 21.9688 4.46049 21.7239 3.80816 21.292C3.15584 20.86 2.63438 20.2575 2.30049 19.55L0.0704871 14.4C0.0200425 14.2729 -0.00378188 14.1367 0.000487192 14V12C0.000487192 11.2044 0.316558 10.4413 0.879167 9.87868C1.44178 9.31607 2.20484 9 3.00049 9H7.00049V5C7.00049 4.20435 7.31656 3.44129 7.87917 2.87868C8.44178 2.31607 9.20484 2 10.0005 2C10.2657 2 10.5201 2.10536 10.7076 2.29289C10.8951 2.48043 11.0005 2.73478 11.0005 3V4.8Z" />
    <path d="M21 11H19C18.4477 11 18 11.4477 18 12V21C18 21.5523 18.4477 22 19 22H21C21.5523 22 22 21.5523 22 21V12C22 11.4477 21.5523 11 21 11Z" />
  </Svg>
);

export default OpinionIcon;
