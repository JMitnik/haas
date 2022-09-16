import { enumType } from 'nexus';

export const ActionableState = enumType({
  name: 'ActionableState',
  members: ['PENDING', 'STALE', 'COMPLETED', 'DROPPED'],
})