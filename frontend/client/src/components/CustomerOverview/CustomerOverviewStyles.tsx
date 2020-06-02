import styled, { css } from 'styled-components/macro';
import { Label, Div } from '@haas/ui';

export const CustomerCardImage = styled.img`
  width: 75px;
  height: 75px;
  object-fit: contain;
`;

export const CustomerCardEnqueteLabel = styled(Label)`
  ${({ theme }) => css`
    text-transform: uppercase;
    color: ${theme.colors.default.muted};
    background: ${theme.colors.default.normal};
    font-size: 12px;

    font-weight: 1000;
    position: absolute;
    top: ${theme.gutter / 2}px;
    right: ${theme.gutter / 2}px;
  `}
`;

export const CustomerOverviewContainer = styled(Div)`
  max-width: 100%;
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 48px;
`;
