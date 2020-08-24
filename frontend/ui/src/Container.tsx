import styled, { css } from 'styled-components/macro';
import {
  flexbox,
  width,
  color,
  space,
  grid,
  border,
  GridProps,
  FlexboxProps,
  WidthProps,
  BorderProps,
  ColorProps,
  FlexProps,
  flexDirection,
  LayoutProps,
  layout,
  PositionProps, 
  position,
  SpaceProps,
} from 'styled-system';
import { Div, GenericProps } from './Generics';

interface ContainerProps extends GenericProps {}

export const Container = styled(Div)<ContainerProps>`
  ${({ theme }) => css`
    position: relative;
    margin: 0 auto;
    width: ${theme.containerWidth}px;
    max-width: 100%;

    ${color}
    ${space}
    ${flexbox}
    ${width}
  `}
`;

export const ViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
  `}
`;

interface ExtraGridProps extends GridProps, WidthProps, LayoutProps, ColorProps, BorderProps, PositionProps, SpaceProps, {}
interface ExtraFlexProps extends FlexboxProps, LayoutProps, WidthProps, BorderProps, GridProps, PositionProps, SpaceProps, ColorProps {
  growChildren?: boolean;
}

export const Flex = styled.div<ExtraFlexProps>`
  ${({ theme, growChildren }) => css`
    display: flex;
    ${flexbox}
    ${layout}
    ${border}
    ${grid}
    ${position}
    ${space}
    ${color}
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
    ${layout}
    ${color}
    ${border}
    ${position}
    ${space}
  `}
`;
