import styled, { css } from 'styled-components/macro';
import { FlexboxProps,
  flexbox, width, WidthProps, color, ColorProps, space, SpaceProps, LayoutProps, layout, FlexProps, flex, PositionProps, position } from 'styled-system';

export interface GenericProps extends FlexboxProps, FlexProps, WidthProps, ColorProps, SpaceProps, LayoutProps, PositionProps {
  useFlex?: boolean;
  fillChildren?: boolean;
}

export const Div = styled.div<GenericProps>`
  ${({ useFlex, fillChildren }) => css`

    ${useFlex && css`display: flex;`}
    ${fillChildren && css` > * {height: 100%; width: 100%;}`}

    ${flexbox};
    ${flex};
    ${width};
    ${color};
    ${space};
    ${layout};
    ${position}
  `}
`;
