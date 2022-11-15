import styled, { css } from 'styled-components';
import {
  layout, LayoutProps,
  typography, TypographyProps,
  color, ColorProps,
  space, SpaceProps
} from 'styled-system';
import { Span } from './Span';

interface IconProps extends LayoutProps, TypographyProps, ColorProps, SpaceProps {
  stroke?: string;
}

export const Icon = styled.span<IconProps>`
  ${({ theme, stroke, width }) => css`
    display: inline-block;
    vertical-align: bottom;

    ${stroke && css`
      svg {
        stroke: ${stroke};
      }
    `}
    ${width && css`
      svg {
        width: width;
        height: auto;
      }
    `}
  `}

  ${color}
  ${typography}
  ${layout}
  ${space}
`;

export const IconBox = styled(Span)`
  ${({ theme }) => css`
    display: flex;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    padding: 4px;
    color: white;
    justify-content: center;
    align-items: center;
  `}
`;

type Size = 'sm' | 'md' | 'lg';

interface ThumbnailProps {
  size?: Size
  bc?: string;
}

export const Thumbnail = styled(Span)<ThumbnailProps>`
  ${({ size = 'md' }) => css`
    display: inline-block;

    svg {
      width: 100%;
      height: 100%;
    }

    ${size === 'sm' && css`
      width: 60px;
      height: 60px;
    `}

    ${size === 'md' && css`
      width: 70px;
      height: 70px;
    `}
  `}
`;

export const Squircle = styled(Span)<ThumbnailProps>`
  ${({ theme, bc, size = 'md' }) => css`
    display: inline-block;
    border-radius: ${theme.borderRadiuses.md}px;
    border-width: 1px;
    border-style: solid;

    ${!bc && css`
      border-color: transparent;
    `}

    ${!!bc && css`
      border-color: ${theme.colors[bc]};
    `}

    svg {
      width: 100%;
      height: 100%;
    }

    ${size === 'sm' && css`
      padding: 4px 6px;
      width: 40px;
      height: 40px;
    `}

    ${size === 'md' && css`
      width: 70px;
      height: 70px;
    `}
  `}
`;
