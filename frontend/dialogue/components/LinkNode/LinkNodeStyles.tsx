import { color } from 'styled-system';
import styled, { css } from 'styled-components';
import chroma from 'chroma-js';

import { makeColorfulBoxShadow } from '../../utils/makeColorfulBoxShadow';

interface LinkItemContainerProps {
  brand: string;
}

export const LinkItemContainer = styled.a<LinkItemContainerProps>`
  ${({ theme, brand }) => css`
    position: relative;
    margin-right: ${theme.gutter / 2}px;
    z-index: 1;

    & > span {
      background: ${brand};
      display: block;
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      cursor: pointer;
      border: 1px solid ${chroma(brand).darken(0.5).hex()};
      z-index: 1;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: ${makeColorfulBoxShadow(brand, false)};
    }

    &:hover > span {
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: ${makeColorfulBoxShadow(brand, true)};
    }

    @media ${theme.media.mob} {
      margin-right: ${theme.gutter / 2}px;
    }

    svg, img {
      @media ${theme.media.desk} {
        height: 25px;
        width: 25px;
      }
    }

    ${color}
  `}
`;
