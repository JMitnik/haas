import { ColorProps, color } from 'styled-system';
import { Div, Flex } from '@haas/ui';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

export const SocialShareNodeContainer = styled(Div)``;

export const ItemContainer = styled(Flex)`
  ${({ theme }) => css`
  flex-wrap: wrap;
  justify-content: center;
  align-items: center; 

  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);

  background: ${Color(theme.colors.primary).lighten(0.2).hex()};

  @media ${theme.media.mob} {
    justify-content: start;
  }
  `}
  
`;

export const ShareItem = styled.a<ColorProps>`
  ${color}

  ${({ theme, bg }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    padding: 10px;
    min-width: 16px;
    margin-right: ${theme.gutter / 2}px;
    margin-bottom: ${theme.gutter / 2}px;
    opacity: 1;

    &:hover{ 
      background-color: ${typeof bg === 'string' && Color(bg).lighten(0.2).hex()}
    }

    > span {
      color: white;
      font-size: 1.1em;
      margin-left: 7.5px;
    }


    
      @media ${theme.media.desk} {
        margin-bottom: 0;
        svg, img {
          height: 25px;
          width: 25px;
        }
      }
   
  `}
`;
