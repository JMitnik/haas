import { Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const ShareItem = styled(Div)`
  ${({ theme, bg }) => css`
    border-radius: 100%;
    padding: 13px;
    display: flex;
    margin-right: ${theme.gutter}px;
    cursor: pointer;

    &:hover {
      background: ${String(bg)};
    }

    svg {
      height: 30px;
      width: 30px;
    }
  `}
`;
