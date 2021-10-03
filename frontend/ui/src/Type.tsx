import React from 'react';
import styled, { css } from 'styled-components';
import { TypographyProps, typography, space, SpaceProps, color, ColorProps } from 'styled-system';
import { Icon, Span, Div } from '.';

interface GenericTypeProps extends TypographyProps, SpaceProps, ColorProps { }

export const GenericType = styled.p<GenericTypeProps>`
  ${color}
  ${space}
  ${typography}
`;

export const Text = styled(GenericType).attrs({ as: 'p' })``;

interface HelperProps {
  color?: string;
}

export const Helper = styled(Text)`
  ${({ theme, color }) => css`
    margin: 0;
    color: ${theme.colors[color]} || ${theme.colors.gray[500]};
    font-weight: 700;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `}
`;

/**
 * Section headers are headers for clearly defined sections.
 */
export const SectionHeader = styled(Text)`
  ${({ theme }) => css`
    font-size: 1rem;
    color: ${theme.colors.gray[700]};
    color: var(--active-brand);
    font-weight: 600;
  `}
`;

/**
 * Section subheaders are headers for clearly defined sections.
 */
export const SectionSubHeader = styled(Text)`
  ${({ theme }) => css`
    color: ${theme.colors.gray[500]};
    font-size: 0.8rem;
  `}
`;

export const SubtlePageHeading = styled(Text)`
  ${({ theme }) => css`
    text-align: center;
    color: ${theme.colors.gray[500]};
    font-size: 2rem;
    font-weight: 200;
  `}
`;

export const SubtlePageSubHeading = styled(Text)`
  ${({ theme }) => css`
    text-align: center;
    max-width: 100%;
    width: 750px;
    margin: 0 auto;
    color: ${theme.colors.gray[300]};
    font-size: 1.5rem;
    font-weight: 100;
  `}
`;

export const Paragraph = styled(GenericType).attrs({ as: 'p' })``;

export const H1 = styled(GenericType).attrs({ as: 'h1' })`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[5]}px;
  `}
`;

export const H2 = styled(GenericType).attrs({ as: 'h2' })`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[4]}px;
  `}
`;

export const PageHeading = styled(H2).attrs({ 'data-cy': 'PageHeading', role: 'heading' })`
  ${({ theme }) => css`
    margin-bottom: ${theme.gutter}px;
  `}
`;

export const H3 = styled(GenericType).attrs({ as: 'h3' })`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[3]}px;
  `}
`;

export const H4 = styled(GenericType).attrs({ as: 'h4' })`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[2]}px;
  `}
`;

export const H5 = styled(GenericType).attrs({ as: 'h5' })`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes[1]}px;
  `}
`;

export const Muted = styled(GenericType).attrs({ as: 'p' })`
  ${({ theme }) => css`
    font-weight: 500;
    font-size: 0.8rem;
    color: ${theme.colors.gray['500']};
  `}
`;
