import { enumType } from 'nexus';

export const SessionActionType = enumType({
  name: 'SessionActionType',
  description: 'Actions expected after session',
  members: ['CONTACT'],
});
