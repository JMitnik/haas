import { Div, H2 } from '@haas/ui';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

export const RegisterNodeContainer = styled(Div)`
  ${({ theme }) => css`
    @media ${theme.media.mob} {
      ${H2} {
        font-size: 1.5em;
      }
    }

    input {
      font-size: ${theme.fontSizes[1]}px;
      width: 100%;
      resize: none;
    }
  `}
`;

export const IconContainer = styled.span`
  ${({ theme }) => css`
    overflow: hidden;
    border-radius: 9px 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: ${Color(theme.colors.primary).lighten(0.3).hex()}; */
    min-height: 24px;
    width: 22px;

    svg {
      width: 100%;
      /* fill: currentColor; */
      height: 24px;

      .secondary {
        fill: ${Color(theme.colors.primary).lighten(0.3).hex()};
      }
    }
  `}
`;

export const InputContainer = styled(Div)`
   ${({ theme }) => css`
    @media ${theme.media.mob} {
      ${H2} {
        font-size: 1.5em;
      }
    }

    svg {
      color: ${Color(theme.colors.primary).mix(Color('black'), 0.1).hex()};
    }
    
    input {
      background-color: ${Color(theme.colors.primary).mix(Color('white'), 0.8).hex()};
      border-radius: 6px;
      color: ${Color(theme.colors.primary).mix(Color('black'), 0.8).hex()};
      opacity: 0.8; 

      ::placeholder {
        color: ${Color(theme.colors.primary).mix(Color('black'), 0.5).hex()};
        opacity: 0.5; 
      }
    }
  `}
`;
