import { motion } from 'framer-motion';
import Color from 'color';
import styled, { css } from 'styled-components/macro';

import { Div } from '@haas/ui';

export const MultiChoiceNodeContainer = styled(Div)`
`;

export const ChoiceIconContainer = styled.span`
  ${({ theme }) => css`
    width: 48px;
    overflow: hidden;
    border-radius: 9px 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: ${Color(theme.colors.primary).lighten(0.3).hex()}; */
    min-height: 24px;

    svg {
      width: 100%;
      fill: ${theme.colors.primary};

      .secondary {
        fill: ${Color(theme.colors.primary).lighten(0.3).hex()};
      }
    }
  `}
`;

export const MultiChoiceNodeGrid = styled(motion.div)`
  ${({ theme }) => css`
    display: grid;
    grid-gap: ${theme.gutter / 1.5}px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

    button {
      box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
      border-radius: 10px;
      transform: none;
      padding: 12px 22px;
      background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.6).hex()}, ${Color(theme.colors.primary).lighten(0.8).hex()}); 
      font-family: 'Open-sans', sans-serif;
      color: ${Color(theme.colors.primary).saturate(0.1).hex()};

      h1,h2,h3,h4,h5 {
        color: inherit;
        font-size: 1.5rem;
        font-family: inherit;
      }
    }

    button:hover {
      box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
      transform: translateY(-1px);
    }
  `}
`;
