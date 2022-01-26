import { enumType } from '@nexus/schema';

export const OperandType = enumType({
  name: 'OperandType',
  members: [
    'STRING',
    'INT',
    'DATE_TIME',
  ],
});
