/* eslint-disable max-len */
import React from 'react';

import styled, { css } from 'styled-components';

const Svg = styled.svg<{isCTA?: Boolean, hasCTA?: Boolean}>`
  ${({ hasCTA, isCTA, theme }) => css`
    color: ${theme.colors.default.darkest};
    stroke: ${theme.colors.gray[400]};

    ${hasCTA && css`
      stroke: ${theme.colors.gray[500]};

      path {
        fill: ${theme.colors.gray[300]};
      }
    `}
  
    path {
      ${!isCTA && css`
        fill: ${theme.colors.gray[200]};
      `}

      ${(isCTA && !hasCTA) && css`
        fill: ${theme.colors.gray[200]};
        opacity: 0.4;
      `}
    }
  `}
`;

const ShareIcon = ({ isCTA, hasCTA } : { isCTA?: Boolean, hasCTA?: Boolean }) => (
  <Svg isCTA={isCTA} hasCTA={hasCTA} width="24" height="24" viewBox="0 0 24 24" stroke="gray.600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </Svg>
);

export default ShareIcon;
