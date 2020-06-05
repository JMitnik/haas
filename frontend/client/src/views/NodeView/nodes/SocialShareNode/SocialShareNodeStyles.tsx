import { Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const ShareItem = styled(Div)`
  ${({ theme, bg }) => css`
    border-radius: 100%;
    padding: 13px;
    display: flex;
    margin-right: ${theme.gutter / 2}px;
    cursor: pointer;

    @media ${theme.media.mob} {
      margin-right: ${theme.gutter}px;
    }

    &:hover {
      background: ${String(bg)};
    }

    svg {
      @media ${theme.media.desk} {
        height: 25px;
        width: 25px;
      }
    }
  `}
`;
