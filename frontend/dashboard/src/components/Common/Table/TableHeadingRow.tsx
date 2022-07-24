import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const HeadingRow = styled(UI.Grid)`
  ${({ theme }) => css`
    background: ${theme.colors.neutral[300]};
    border: 1px solid ${theme.colors.off[100]};
    padding: 8px ${theme.gutter}px;
    box-shadow: ${theme.boxShadows.sm};
    border-radius: ${theme.borderRadiuses.lg}px;
    margin-bottom: 12px;
  `}
`;
