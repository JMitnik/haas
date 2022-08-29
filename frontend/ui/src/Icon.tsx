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
  ${({ theme, stroke }) => css`
    display: inline-block;
    vertical-align: bottom;

    ${stroke && css`
      svg {
        stroke: ${stroke};
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
}

export const Thumbnail = styled(Span)<ThumbnailProps>`
  ${({ size = 'md' }) => css`
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
