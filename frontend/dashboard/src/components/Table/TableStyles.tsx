import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

export const TableContainer = styled(Div)`
  ${({ theme }) => css`
    background: white;
    border-radius: ${theme.borderRadiuses.lg};
    grid-template-rows: repeat(9, minmax(50px, auto));
    grid-row-gap: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `}
`;
