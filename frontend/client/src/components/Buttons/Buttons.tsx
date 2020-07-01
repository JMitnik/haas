import styled, { css } from 'styled-components/macro';

import { Button, H5 } from '@haas/ui';

export const ButtonBody = styled.span``;

export const ClientButton = styled(Button)`
  ${({ isActive, theme }) => css`
    width: 400px;
    justify-content: flex-start;
    border: none;
    max-width: 100%;
    background: none;
    display: flex;
    align-items: stretch;
    background: white;
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.10);
    position: relative;
    justify-content: flex-start;
    padding: 0 !important;

    ${ButtonBody} {
      width: 100%;
      text-align: left;
      padding-left: 24px;

      border-radius: 0 10px 10px 0;
      /* background: white; */

      h1, h2, h3, h4 ,h5 {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    > * {
      padding: 12px;
    }

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

    ${isActive
      && css`
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
