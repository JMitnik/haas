import styled, { css } from 'styled-components/macro';
import {
  flexbox,
  width,
  color,
  space,
  grid,
  GridProps,
  FlexboxProps,
  WidthProps,
  FlexProps,
  flexDirection,
  LayoutProps,
  layout
} from 'styled-system';
import { Div, GenericProps } from './Generics';

interface ContainerProps extends GenericProps {}

export const Container = styled(Div)<ContainerProps>`
  ${({ theme }) => css`
    position: relative;
    margin: 0 auto;
    width: ${theme.containerWidth}px;

    ${color}
    ${space}
    ${flexbox}
    ${width}
  `}
`;
interface ExtraGridProps extends GridProps, WidthProps {}
interface ExtraFlexProps extends FlexboxProps, LayoutProps, WidthProps {
  growChildren?: boolean;
}

export const Flex = styled.div<ExtraFlexProps>`
  ${({ theme, growChildren }) => css`
    display: flex;
    ${flexbox}
    ${layout}
  `};
`;

export const ColumnFlex = styled.div<ExtraFlexProps>`
  ${({ theme, growChildren }) => css`
      display: flex;
      flex-direction: column;

      ${!!growChildren &&
        css`
          > * {
            flex-grow: 1;
          }
        `}
      ${flexbox}
      ${layout}
  `};
`;



export const Grid = styled.div<ExtraGridProps>`
  ${({ theme }) => css`
    display: grid;
    grid-gap: ${theme.gutter}px;
    ${grid}
    ${width}
  `}
`;
