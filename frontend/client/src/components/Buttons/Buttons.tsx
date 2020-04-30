import styled, { css } from 'styled-components/macro';
import { Button, H5 } from '@haas/ui';

export const ClientButton = styled(Button)`
  ${({ theme, isActive }) => css`
    width: 400px;
    border: none;
    max-width: 100%;
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.10);
    position: relative;

    ${H5} {
      z-index: 100;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }

    &:focus {
      background: rgba(0, 0, 0, 0.1);
      outline: none;
    }

    ${isActive &&
      css`
        background: white;

        &:hover {
          background: rgb(255, 255, 255, 0.9);
        }

        &:focus {
          background: rgb(255, 255, 255, 0.8);
        }

        &::after {
          visibility: hidden;
        }
      `}
  `}
`;
