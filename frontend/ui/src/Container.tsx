import React from 'react';
import styled, { css } from 'styled-components';
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
  LayoutProps,
  layout,
  PositionProps,
  position,
  SpaceProps,
} from 'styled-system';
import { Stack as ChakraStack, StackProps as ChakraStackProps  } from '@chakra-ui/core';
import { Div, GenericProps } from './Generics';
import { ViewTitle, ViewTitleContainer } from './Type';

interface ContainerProps extends GenericProps {}

export const Stack = (props: ChakraStackProps) => (
  <ChakraStack {...props} />
)

export const PageContainer = styled(Div)`
  width: 100%;
  height: 100vh;
`

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

const ViewHeadContainer = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.gray[100]};
    padding: ${theme.gutter / 2}px ${theme.gutter}px;
    border-bottom: 1px solid ${theme.colors.gray[200]};
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;

    ${ViewTitleContainer} {
      margin-bottom: 0;
    }
  `}
`;

export const ViewHead = ({ children }: { children: React.ReactNode }) => (
  <ViewHeadContainer>
    <Stack spacing={4} isInline alignItems="center">
      {children}
    </Stack>
  </ViewHeadContainer>
);

export const ViewContainer = styled(Div)<{ isCompact?: boolean; }>`
  ${({ theme, isCompact }) => css`
    margin: 0 auto;
    min-height: 100vh;

    ${isCompact && css`
      max-width: 1400px;
    `}
  `}
`;

export const ViewBody = styled(Div)<{ isCompact?: boolean; }>`
  ${({ theme, isCompact }) => css`
    margin: 0 auto;
    min-height: 100vh;
    padding: ${theme.gutter}px;

    ${isCompact && css`
      max-width: 1400px;
    `}
  `}
`;

interface ExtraGridProps extends GridProps, WidthProps, LayoutProps, ColorProps, BorderProps, PositionProps, SpaceProps {}
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
    ${flexbox}
    ${width}
    ${layout}
    ${color}
    ${border}
    ${position}
    ${space}
  `}
`;
