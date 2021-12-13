import { inputObjectType } from '@nexus/schema';

export const SessionEventInput = inputObjectType({
  name: 'SessionEventInput',
  description: 'Input type of a SessionEvent',

  definition(t) {

    t.date('createdAt');
  },
});
