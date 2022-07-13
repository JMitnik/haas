import { enumType } from '@nexus/schema';

export const SessionActionType = enumType({
  name: 'SessionActionType',
  description: 'Actions expected after session',
  members: ['CONTACT'],
});
