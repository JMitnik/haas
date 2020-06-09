import styled from 'styled-components/macro';
import {
  layout, LayoutProps,
  typography, TypographyProps,
  color, ColorProps,
  space, SpaceProps } from 'styled-system';

interface SpanProps extends LayoutProps, TypographyProps, ColorProps, SpaceProps {}

export const Span = styled.span<SpanProps>`
  ${color}
  ${typography}
  ${layout}
  ${space}
`;
