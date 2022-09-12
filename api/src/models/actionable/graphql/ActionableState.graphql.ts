import { enumType } from 'nexus';

export const ActionableState = enumType({
  name: 'ActionableState',
  members: ['UNVERIFIED', 'PENDING', 'STALE', 'COMPLETED', 'DROPPED']
})