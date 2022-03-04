import { inputObjectType } from '@nexus/schema';

import { SessionActionInput } from "./SessionActionInput";
import { SessionStateInput } from "./SessionStateInput";

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
