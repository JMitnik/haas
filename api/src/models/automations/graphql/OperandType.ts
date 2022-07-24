import { enumType } from 'nexus';

export const OperandType = enumType({
  name: 'OperandType',
  members: [
    'STRING',
    'INT',
    'DATE_TIME',
  ],
});
