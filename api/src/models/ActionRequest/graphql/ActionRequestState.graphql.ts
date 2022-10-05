import { enumType } from 'nexus';

export const ActionRequestState = enumType({
  name: 'ActionRequestState',
  members: ['PENDING', 'STALE', 'COMPLETED', 'DROPPED'],
})