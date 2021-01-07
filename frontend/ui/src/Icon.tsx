import styled, { css } from 'styled-components';
import {
  layout, LayoutProps,
  typography, TypographyProps,
  color, ColorProps,
  space, SpaceProps } from 'styled-system';
import { Span } from '.';

interface IconProps extends LayoutProps, TypographyProps, ColorProps, SpaceProps {}

export const Icon = styled.span<IconProps>`
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