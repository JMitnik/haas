import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const HeadingRow = styled(UI.Grid)`
  ${({ theme }) => css`
    background: ${theme.colors.gray[100]};
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 12px;
  `}
`;
