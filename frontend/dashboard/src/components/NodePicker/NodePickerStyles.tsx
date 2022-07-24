import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const NodePickerHeader = styled(UI.Flex)`
   ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.gray[200]};
    align-items: baseline;
  `}
`;
