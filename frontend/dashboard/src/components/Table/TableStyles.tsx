import { ContextButtonContainer } from 'components/ContextButton/ContextButton';
import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

export const ExpandedRowContainer = styled(Div)``;

export const RowContainer = styled(Div)<{enableHover?: boolean}>`
  ${({ theme, enableHover }) => css`
    cursor: pointer;
    position: relative;
    z-index: 200;
    padding-left: ${theme.gutter}px;
    padding-right: ${theme.gutter}px;
    padding-top: ${theme.gutter / 3}px;
    padding-bottom: ${theme.gutter / 3}px;

    &:nth-child(even) {
      background: ${theme.colors.gray[50]};
    }

    ${enableHover && css`
      &:hover {
        position: relative;
        z-index: 100;
        background: ${theme.colors.gray[100]};
        transition: all .2s cubic-bezier(.55,0,.1,1);
      }
    `}

    ${ExpandedRowContainer} {
      margin-left: -${theme.gutter}px;
      margin-right: -${theme.gutter}px;
    }

    ${ContextButtonContainer} {
      display: flex;
      align-items: center;
    }
  `}
`;

export const TableContainer = styled(Div)`
  ${({ theme }) => css`
    background: white;
    border-radius: ${theme.borderRadiuses.lg};
    grid-template-rows: repeat(9, minmax(50px, auto));
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `}
`;
