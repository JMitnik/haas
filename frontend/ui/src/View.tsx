import React from 'react';
import styled, { css } from 'styled-components';
import { Div } from './Generics';
import { Container, Stack } from './Container';
import { Icon } from './Icon';
import { Span } from './Span';
import { H2, Text } from './Type';
import { motion } from 'framer-motion';


interface ViewTitleProps {
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const DeprecatedViewTitleContainer = styled(Span)`
  ${({ theme }) => css`
    color: ${theme.colors.gray[600]};
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;

    svg {
      width: 24px;
    }
  `}
`;

export const DeprecatedViewTitle = ({ leftIcon, children, ...props }: ViewTitleProps) => (
  <DeprecatedViewTitleContainer {...props}>
    {!!leftIcon && (
      <Icon display="inline-block" width="24px" mr={1}>
        {leftIcon}
      </Icon>
    )}
    {children}
  </DeprecatedViewTitleContainer>
);

export const ViewHeadContainer = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.app.background};
    padding: ${theme.gutter}px ${theme.gutter}px;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;

    max-width: 1400px;
    width: 100%;
    margin: 0 auto;

    ${DeprecatedViewTitleContainer} {
      margin-bottom: 0;
    }
  `}
`;

interface ViewHeadProps {
  children: React.ReactNode;
  renderBreadCrumb?: React.ReactNode;
  compact?: boolean;
}

export const ViewHead = ({ children, renderBreadCrumb, compact = false }: ViewHeadProps) => (
  <ViewHeadContainer>
    {!!renderBreadCrumb && renderBreadCrumb}

    {compact && (
      <Container>
        <Stack spacing={4}>
          {children}
        </Stack>
      </Container>
    )}

    {!compact && (
      <Stack spacing={4}>
        {children}
      </Stack>
    )}
  </ViewHeadContainer>
);

interface ViewHeadProps {
  children: React.ReactNode;
}

export const ViewTitle = ({ children }: ViewHeadProps) => (
  <H2 lineHeight={1.4} style={{ display: 'inline-block' }} forwardedAs={motion.div} color="main.500">
    {children}
  </H2>
)

export const ViewSubTitle = ({ children }: ViewHeadProps) => (
  <Text fontSize="1.1rem" color="off.500" fontWeight={500}>
    {children}
  </Text>
);

export const ViewContainer = styled(Div) <{ isCompact?: boolean; }>`
  ${({ theme, isCompact }) => css`
    margin: 0 auto;
    min-height: 100vh;

    ${isCompact && css`
      max-width: 1400px;
    `}
  `}
`;

export const ViewBodyContainer = styled(Div)`
  ${({ theme, padding }) => css`
    margin: 0 auto;
    max-width: 1400px;
    width: 100%;
    padding: ${theme.gutter}px ${theme.gutter}px;
    background: ${theme.colors.app.background};
  `}
`;

interface ViewBodyProps {
  children: React.ReactNode;
  compact?: boolean;
}

export const ViewBody = ({ children, compact = false }: ViewBodyProps) => {
  return (
    <ViewBodyContainer>
      {compact && (
        <Container>
          {children}
        </Container>
      )}

      {!compact && (
        <>
          {children}
        </>
      )}
    </ViewBodyContainer>
  )
}
