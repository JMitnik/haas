import { enumType } from '@nexus/schema';

export const StatusType = enumType({
  name: 'StatusType',
  description: 'A status is a label that indicates the current state of a process.',
  members: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
});
