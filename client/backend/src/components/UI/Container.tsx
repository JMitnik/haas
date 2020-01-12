import styled, { css } from 'styled-components';
import { flexbox,
  width, color, space, grid, GridProps, FlexboxProps } from 'styled-system';
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

export const Flex = styled.div<FlexboxProps>`
  display: flex;

  ${flexbox}
`;

export const Grid = styled.div<GridProps>`
  display: grid;
  ${grid}
`;
