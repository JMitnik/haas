import styled, { css } from 'styled-components';
import { FlexboxProps,
  flexbox, width, WidthProps, color, ColorProps, space, SpaceProps, LayoutProps, layout, FlexProps, flex } from 'styled-system';

export interface GenericProps extends FlexboxProps, FlexProps, WidthProps, ColorProps, SpaceProps, LayoutProps {
  useFlex?: boolean;
}

export const Div = styled.div<GenericProps>`
  ${({ useFlex }) => css`

    ${useFlex && css`display: flex;`}

    ${flexbox};
    ${flex};
    ${width};
    ${color};
    ${space};
    ${layout};
  `}
`;
