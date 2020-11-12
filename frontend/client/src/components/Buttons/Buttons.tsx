import Color from 'color';
import styled, { css } from 'styled-components/macro';

import { Button, H5 } from '@haas/ui';

export const ButtonBody = styled.span``;

export const OutlineButton = styled(Button)`
  ${({ theme }) => css`
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex()
    : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
    background: transparent;
    border-radius: 10px;
    border: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `}
`;

export const ClientButton = styled(Button)`
  ${({ isActive = true, theme }) => css`
    width: 100%;
    grid-column: 1 / 2;
    justify-content: flex-start;
    border: none;
    max-width: 100%;
    background: none;
    display: flex;
    align-items: stretch;
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.10);
    position: relative;
    justify-content: flex-start;
    align-items: center;
    padding: 0 !important;
    box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
    border-radius: 10px;
    transform: none;
    padding: 12px 22px;
    font-size: 1rem;
    background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.3).hex()}, ${Color(theme.colors.primary).lighten(0.3).saturate(1).hex()}); 
    font-family: 'Open-sans', sans-serif;
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex()
    : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};

    ${ButtonBody} {
      width: 100%;
      text-align: left;
      padding-left: 24px;
      border-radius: 0 10px 10px 0;

      h1, h2, h3, h4 ,h5 {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    ${!isActive && css`
      opacity: 0.4;
    `}

    > * {
      padding: 12px;
    }

    ${H5} {
      font-size: 1rem;
      z-index: 100;
    }


    &:focus {
      outline: none;
    }
  `}
`;
