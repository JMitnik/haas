import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const ControlButton = styled(UI.Button)`
  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    box-shadow: ${theme.boxShadows.md};
    border-radius: ${theme.borderRadiuses.md}px;
    color: ${theme.colors.main[500]};
    width: 30px;
    height: 30px;

    ${UI.Icon} svg {
      max-width: 100%;
    }
  `}
`;
