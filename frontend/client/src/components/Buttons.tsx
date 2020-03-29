import styled, { css } from 'styled-components/macro';
import { Button, H5 } from '@haas/ui';

export const ClientButton = styled(Button)`
  ${({ theme, isActive }) => css`
    width: 400px;
    max-width: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: relative;

    ${H5} {
      z-index: 100;
    }

    &::after {
      content: '';
      z-index: 50;
      position: absolute;
      background: rgba(0, 0, 0, 0.1);
      transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
      left: 0;
      border-radius: 100px;
      bottom: 0;
      right: 3px;
      bottom: -5%;
      width: 100%;
      height: 115%;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.4);

      &::after {
        background: rgba(0, 0, 0, 0.3);
        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
      }
    }

    &:focus {
      background: rgba(0, 0, 0, 0.1);
      outline: none;
    }

    ${isActive &&
      css`
        background: white;

        &:hover {
          background: rgba(1, 1, 1, 1);
        }

        &::after {
          visibility: hidden;
        }
      `}
  `}
`;
