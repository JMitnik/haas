import styled, { css } from 'styled-components';
import { FlexboxProps, borderRadius, border, BorderProps,
  flexbox, width, WidthProps, color, ColorProps, space, SpaceProps, LayoutProps, layout, FlexProps, flex, PositionProps, position, grid, GridProps } from 'styled-system';

export interface GenericProps extends FlexboxProps, FlexProps, WidthProps, BorderProps, ColorProps, SpaceProps, LayoutProps, PositionProps, GridProps {
  useFlex?: boolean;
  useGrid?: boolean;
  fillChildren?: boolean;
}

export const Div = styled.div<GenericProps>`
  ${({ useFlex, useGrid, fillChildren }) => css`
    ${useFlex && css`display: flex;`}
    ${useGrid && css`display: grid;`}
    ${fillChildren && css` > * {height: 100%; width: 100%;}`}

    
    ${grid}
    ${flexbox};
    ${flex};
    ${width};
    ${border}
    ${borderRadius}
    ${color};
    ${space};
    ${layout};
    ${position}
  `}
`;
