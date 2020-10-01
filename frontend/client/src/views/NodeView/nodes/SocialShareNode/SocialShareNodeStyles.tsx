import { ColorProps, color } from 'styled-system';
import { Div, Flex } from '@haas/ui';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

export const SocialShareNodeContainer = styled(Div)``;

export const ShareContainer = styled(Div)`
    ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-radius: 6px;
    background: rgba(0,0,0,0.5);
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    backdrop-filter: saturate(180%) blur(20px);
    div > span {
      align-self: flex-start;
      color: ${Color(theme.colors.primary).lighten(0.35).hex()};
      margin-left: 5px;
    }

    div > svg {
      height: 1.2em;
      width: 1.2em;
      color: ${Color(theme.colors.primary).lighten(0.35).hex()};
    }
  `}
  
`;

export const ItemContainer = styled(Flex)`
  ${({ theme }) => css`
  flex-wrap: wrap;
  justify-content: center;
  align-items: center; 

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
    min-width: 45px;
    min-height: 45px;
    margin-right: ${theme.gutter / 1.5}px;
    margin-bottom: ${theme.gutter / 1.5}px;
    opacity: 1;

    &:hover{ 
      background-color: ${typeof bg === 'string' && Color(bg).lighten(0.2).hex()}
    }

    > span {
      color: white;
      font-size: 1em;
      margin-left: 7.5px;
    }

    svg, img {
      width: 16px;
      height: 16px;
    }

    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    transform: scale(1);
    animation: pulse 2s infinite;

    @keyframes pulse {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
        }

        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }

        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
    }

    @media ${theme.media.desk} {
      margin-bottom: 0;
      svg, img {
        height: 20px;
        width: 20px;
      }
    }
   
  `}
`;
