import { Card } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const CustomerCardImage = styled.img`
  position: absolute;
  right: 0;
  width: 60%;
  opacity: 0.1;
  z-index: 1;
  /* border-radius: 100%; */
  mix-blend-mode: multiply;
  transition: all .3s cubic-bezier(.55,0,.1,1);

  bottom: 0;
  object-fit: cover;
  transition: all .3s cubic-bezier(.55,0,.1,1);
  max-height: 70%;
  object-position: top right;
`;

export const CustomerOverviewContainer = styled.div`
  ${({ theme }) => css`
    /* min-height: 100vh; */
    /* padding: ${theme.gutter * 3}px; */

    ${Card}:hover {
      ${CustomerCardImage} {
        transition: all .3s cubic-bezier(.55,0,.1,1);
        filter: none;
        opacity: 0.3;
      }
    }
  `}
`;
