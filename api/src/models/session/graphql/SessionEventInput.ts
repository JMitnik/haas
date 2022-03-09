import { inputObjectType } from '@nexus/schema';

import { SessionStateInput } from './SessionStateInput';
import { SessionActionInput } from './SessionActionInput';

export const SessionEventInput = inputObjectType({
  name: 'SessionEventInput',
  description: 'Input type of a SessionEvent',

  definition(t) {
    t.string('sessionId', { required: true });
    t.date('timestamp', { required: true });

    t.field('state', { type: SessionStateInput });
    t.field('action', { type: SessionActionInput });
  },
});
