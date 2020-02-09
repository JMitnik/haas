import styled, { css } from 'styled-components';
import { flexbox,
  width, color, space, grid, GridProps, FlexboxProps, FlexProps, flexDirection, LayoutProps, layout } from 'styled-system';
import { Div, GenericProps } from './Generics';

interface ContainerProps extends GenericProps {}

export const Container = styled(Div)<ContainerProps>`
  ${({ theme }) => css`
    margin: 0 auto;
    width: ${theme.containerWidth}px;

    ${color}
    ${space}
    ${flexbox}
    ${width}
  `}
`;

interface ExtraFlexProps extends FlexboxProps, LayoutProps {
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

      ${!!growChildren && css`
        > * {
          flex-grow: 1;
        }
      `}
      ${flexbox}
      ${layout}
  `};
`;

export const Grid = styled.div<GridProps>`
  display: grid;
  ${grid}
`;
