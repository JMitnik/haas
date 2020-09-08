import { ColorProps, color } from 'styled-system';
import { Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const SocialShareNodeContainer = styled(Div)``;

export const ShareItem = styled.a<ColorProps>`
  ${color}

  ${({ theme }) => css`
    border-radius: 6px;
    padding: 10px;
    display: flex;
    align-items: center;
    min-width: 16px;
    margin-right: ${theme.gutter / 2}px;
    cursor: pointer;
    opacity: 1;

    &:hover{ 
      opacity: 0.8; 
      transition: all 0.3s ease-in-out;
    }

 

    > span {
      color: white;
      font-size: 1.1em;
      margin-left: 7.5px;
    }

    @media ${theme.media.mob} {
      margin-right: ${theme.gutter}px;
      &:first-of-type {
        margin-left: ${theme.gutter}px;
      }
    }

    svg, img {
      @media ${theme.media.desk} {
        height: 25px;
        width: 25px;
      }
    }
  `}
`;
