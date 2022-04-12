import React from 'react';
import styled, { css } from 'styled-components';
import { Div } from './Generics';
import { Stack } from './Container';
import { Icon } from './Icon';
import { Span } from './Span';


interface ViewTitleProps {
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ViewTitleContainer = styled(Span)`
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

export const ViewTitle = ({ leftIcon, children, ...props }: ViewTitleProps) => (
  <ViewTitleContainer {...props}>
    {!!leftIcon && (
      <Icon display="inline-block" width="24px" mr={1}>
        {leftIcon}
      </Icon>
    )}
    {children}
  </ViewTitleContainer>
);

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
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    ${ViewTitleContainer} {
      margin-bottom: 0;
    }
  `}
`;

interface ViewHeadProps {
  children: React.ReactNode;
  renderBreadCrumb?: React.ReactNode;
}

export const ViewHead = ({ children, renderBreadCrumb }: ViewHeadProps) => (
  <ViewHeadContainer>
    {!!renderBreadCrumb && renderBreadCrumb}

    <Stack spacing={4} isInline alignItems="center">
      {children}
    </Stack>
  </ViewHeadContainer>
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

export const ViewBody = styled(Div) <{ isCompact?: boolean; }>`
${({ theme, isCompact, padding }) => css`
  margin: 0 auto;
  padding: ${padding ?? theme.gutter}px;
  background: ${theme.colors.gray[50]};

  ${isCompact && css`
    max-width: 1400px;
  `}
`}
`;
