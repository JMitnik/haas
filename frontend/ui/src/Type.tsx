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
    font-weight: 400;
    font-size: 0.8rem;
    color: ${theme.colors.gray['500']};
  `}
`;