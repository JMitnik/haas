import { Button } from '@chakra-ui/core';
import { H5 } from '@haas/ui';
import styled, { css } from 'styled-components';

type Size = 'sm' | 'md' | 'lg';

export const ButtonBody = styled.span``;

export const GradientButton = styled(Button)<{ usePulse?: boolean; size?: Size }>`
  ${({ isActive = true, theme, usePulse = false, size }) => css`
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
    padding: 12px !important;
    font-size: 1rem;
    background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.3).hex()}, ${Color(theme.colors.primary).lighten(0.3).saturate(1).hex()});
    font-family: 'Inter', sans-serif;
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex()
    : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
    white-space: normal !important;

    &:disabled {
      background: linear-gradient(45deg, ${Color(theme.colors.gray[500]).lighten(0.3).hex()}, ${Color(theme.colors.gray[500]).lighten(0.3).saturate(1).hex()});
    }

    > svg {
      width: 24px;
      height: 24px;
    }

    ${size && size === 'lg' && css`
      font-size: 1.5rem;
      padding: 30px !important;
    `}

    ${ButtonBody} {
      width: 100%;
      text-align: left;
      border-radius: 0 10px 10px 0;

      h1, h2, h3, h4 ,h5 {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    ${usePulse && css`
      animation: 2s pulse infinite;
    `}

    ${!isActive && css`
      opacity: 0.4;
    `}

    ${H5} {
      font-size: 1rem;
      z-index: 100;
    }

    &:focus {
      outline: none;
    }


    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(${Color(theme.colors.primary).array().join(',')}, 0.7);
      }

      70% {
        transform: scale(1);
        box-shadow: 0 0 0 50px rgba(${Color(theme.colors.primary).array().join(',')}, 0);
      }

      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0px rgba(${Color(theme.colors.primary).array().join(',')}, 0);
      }
    }
  `}
`;
