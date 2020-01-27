import styled from 'styled-components';
import {
  layout, LayoutProps,
  typography, TypographyProps,
  color, ColorProps,
  space, SpaceProps } from 'styled-system';

interface IconProps extends LayoutProps, TypographyProps, ColorProps, SpaceProps {}

export const Icon = styled.span<IconProps>`
  ${color}
  ${typography}
  ${layout}
  ${space}
`;
