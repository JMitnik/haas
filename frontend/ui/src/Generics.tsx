import styled, { css } from 'styled-components';
import {
  FlexboxProps, borderRadius, border, BorderProps,
  flexbox, width, WidthProps, color, ColorProps, space, SpaceProps, LayoutProps, layout, FlexProps, flex, PositionProps, position, grid, GridProps
} from 'styled-system';

export interface GenericProps extends FlexboxProps, FlexProps, WidthProps, BorderProps, ColorProps, SpaceProps, LayoutProps, PositionProps, GridProps {
  useFlex?: boolean;
  useGrid?: boolean;
  fillChildren?: boolean;
}

export interface AccentBorderProps extends GenericProps {
  accentBorderPosition?: 'left' | 'top' | 'right' | 'bottom';
  accentBorderSize?: string;
}

export const AccentBorder = styled.div<AccentBorderProps>`
  ${({ accentBorderPosition = 'left', theme, backgroundColor = 'lightgrey', accentBorderSize = "8px" }) => css`
    position: absolute;
    
    background-color: ${backgroundColor?.toString()};
    ${accentBorderPosition === 'left' && css`
      width: ${accentBorderSize};
      height: 100%;
      left: 0;
      top: 0;
      border-radius: ${theme.borderRadiuses.somewhatRounded} 0px 0px ${theme.borderRadiuses.somewhatRounded};
    `}

    ${accentBorderPosition === 'top' && css`
      width: 100%;
      height: ${accentBorderSize};
      left: 0;
      top: 0;
      border-radius: ${theme.borderRadiuses.somewhatRounded} ${theme.borderRadiuses.somewhatRounded} 0px 0px ;
    `}

    ${accentBorderPosition === 'right' && css`
      width: ${accentBorderSize};
      height: 100%;
      right: 0;
      top: 0;
      border-radius: 0px ${theme.borderRadiuses.somewhatRounded} ${theme.borderRadiuses.somewhatRounded} 0px;
    `}

    ${accentBorderPosition === 'bottom' && css`
      width: 100%;
      height: ${accentBorderSize};
      left: 0;
      bottom: 0;
      border-radius: 0px 0px ${theme.borderRadiuses.somewhatRounded} ${theme.borderRadiuses.somewhatRounded};
    `}

  `}
`

export const Div = styled.div<GenericProps>`
  ${grid}
  ${flexbox};
  ${flex};
  ${width};
  ${border}
  ${borderRadius}
  ${color};
  ${space};
  ${layout};
  ${position};

  ${({ useFlex, useGrid, fillChildren }) => css`
    ${useFlex && css`display: flex;`}
    ${useGrid && css`display: grid;`}
    ${fillChildren && css` > * {height: 100%; width: 100%;}`}
  `}
`;
