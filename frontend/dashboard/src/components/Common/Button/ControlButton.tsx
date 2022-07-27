import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const ControlButton = styled(UI.Button)`
  ${({ theme }) => css`
    background-color: ${theme.colors.white} !important;
    box-shadow: ${theme.boxShadows.md};
    border-radius: ${theme.borderRadiuses.md}px;
    color: ${theme.colors.off[500]} !important;
    transition: all ${theme.transitions.normal};
    font-size: 0.7rem;
    height: 100%;

    &[aria-disabled='true'] {
      opacity: 0.5;
      background: ${theme.colors.off[200]} !important;
      box-shadow: ${theme.boxShadows.md} !important;
    }

    &:hover {
      box-shadow: ${theme.boxShadows.lg};
      transition: all ${theme.transitions.normal};
      color: ${theme.colors.main[500]} !important;
    }

    svg {
      color: inherit;
    }

    ${UI.Icon} svg {
      width: 21px !important;
    }
  `}
`;
