import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const CronScheduleHeader = styled(UI.Div)`
  ${({ theme }) => css`
      color: ${theme.colors.off[600]};
      font-weight: bold;
  `}
`;

export const OPERATORS = [
  {
    label: '<',
    value: 'SMALLER_THAN',
  },
  {
    label: '<=',
    value: 'SMALLER_OR_EQUAL_THAN',
  },
  {
    label: '>',
    value: 'GREATER_THAN',
  },
  {
    label: '>=',
    value: 'GREATER_OR_EQUAL_THAN',
  },
  {
    value: 'IS_EQUAL',
    label: '==',
  },
];

export enum ModalType {
  CreateCondition = 'CREATE_CONDITION',
  CreateAction = 'CREATE_ACTION',
}

export interface ModalState {
  isOpen: boolean;
  modal?: ModalType;
  arrayKey?: string;
}
