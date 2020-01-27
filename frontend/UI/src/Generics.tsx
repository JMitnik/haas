import styled, { css } from 'styled-components';
import { FlexboxProps,
  flexbox, width, WidthProps, color, ColorProps, space, SpaceProps } from 'styled-system';

export interface GenericProps extends FlexboxProps, WidthProps, ColorProps, SpaceProps {
  useFlex?: boolean;
}

export const Div = styled.div<GenericProps>`
  ${({ useFlex }) => css`

    ${useFlex && css`display: flex;`}

    ${flexbox};
    ${width};
    ${color};
    ${space};
  `}
`;
