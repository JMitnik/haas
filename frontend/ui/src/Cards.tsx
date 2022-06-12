import styled, { css } from 'styled-components';
import { get } from 'lodash';

import { Div } from './Generics';
import { Span } from './Span';
import { Button } from './Buttons';

export type BoxShadowSize = 'sm' | 'md' | 'lg';

export const ButtonCard = styled(Button) <{ isActive: boolean }>`
  ${({ theme, isActive }) => css`
    border-radius: ${theme.borderRadiuses.md};
    box-shadow: ${theme.boxShadows.md};
    border: 1px solid #ebebeb;
    padding: 4px 8px;
    outline: none;
    overflow: hidden;
    position: relative;

    &:focus, &:active {
      outline: 0 !important;
      background: ${theme.colors.gray[100]};
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) !important;
    }

    ${isActive && css`
      background: ${theme.colors.gray[100]};
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

      &::before {
        content: '';
        top: 0;
        z-index: 200;
        bottom: 0;
        position: absolute;
        left: 0;
        height: 100%;
        width: 3px;
        background: ${theme.colors.primaryGradient};
      }
    `}
  `}
`;

export const CardBody = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 0.75}px;
    flex-grow: 1;
    position: relative;
  `}
`;

export const CardBodyLarge = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 1.25}px;
    flex-grow: 1;
    position: relative;
  `}
`;

export const CardFooter = styled(Div)`
  ${({ theme, color = 'default.text' }) => css`
    padding: ${theme.gutter * 0.75}px;
    border-radius: 0 0 ${theme.borderRadiuses.lg}px ${theme.borderRadiuses.lg}px;
    color: ${get(theme.colors, color)};
  `}
`;

export const CardScore = styled(Span)`
  ${({ theme }) => css`
    text-align: center;
    font-weight: 800;
    padding: 4px 8px;
    margin-bottom: 12px;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${theme.colors.gray['400']};
    color: ${theme.colors.gray['400']};
    border-radius: 30px;
  `}
`;

/**
 * New card
 *
 * TODO: Deprecate old card and rename this to Card.
 */
interface NewCardProps {
  hasHover?: boolean;
  boxShadow?: BoxShadowSize;
  hasBlur?: boolean;
}

export const NewCard = styled(Div)<NewCardProps>`
  ${({ theme, hasHover, boxShadow = 'md', bg = 'white', hasBlur = false }) => css`
    background: ${get(theme.colors, bg as string)};
    border-radius: ${theme.borderRadiuses.lg}px;
    box-shadow: ${theme.boxShadows[boxShadow]};
    transition: all ${theme.transitions.normal};

    ${hasHover && css`
      cursor: pointer;

      &:hover {
        transition: all ${theme.transitions.normal};
        box-shadow: ${theme.boxShadows.lg};
      }
    `}

    ${hasBlur && css`
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(30px);
    `}
  `}
`;
