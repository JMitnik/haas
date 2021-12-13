import { inputObjectType, mutationField, objectType } from '@nexus/schema';

export const SessionEvent = objectType({
  name: 'SessionEvent',
  description: 'A session event describes an action of a user during a session they had with the dialogue.',

  definition(t) {
    t.id('id');
    t.date('createdAt');
  },
});
