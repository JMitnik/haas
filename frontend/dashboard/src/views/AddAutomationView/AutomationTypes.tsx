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
