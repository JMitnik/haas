import { ColorProps, color } from 'styled-system';
import styled, { css } from 'styled-components';

export const LinkItemContainer = styled.a<ColorProps>`
  ${color}

  ${({ theme }) => css`
    border-radius: 100%;
    padding: 13px;
    display: flex;
    margin-right: ${theme.gutter / 2}px;
    cursor: pointer;

    @media ${theme.media.mob} {
      margin-right: ${theme.gutter / 2}px;
    }

    svg, img {
      @media ${theme.media.desk} {
        height: 25px;
        width: 25px;
      }
    }
  `}
`;
