import styled, { css } from 'styled-components/macro';
import { TypographyProps, typography, space, SpaceProps, color, ColorProps } from 'styled-system';

interface GenericTypeProps extends TypographyProps, SpaceProps, ColorProps {}

export const GenericType = styled.p<GenericTypeProps>`
  ${color}
  ${space}
  ${typography}
`;

export const Text = styled(GenericType).attrs({ as: 'p' })``;

export const PageTitle = styled(Text)`
  ${({ theme }) => css`
    margin-bottom: ${theme.gutter}px;
    color: ${theme.colors.gray[500]};
    font-size: 1.6rem;
    font-weight: 900;
    display: flex;
    align-items: center;
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
