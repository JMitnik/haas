import { inputObjectType, objectType } from '@nexus/schema';

export const HealthScoreInput = inputObjectType({
  name: 'HealthScoreInput',
  definition(t) {
    t.float('threshold', { default: 70 });
    t.string('startDateTime', { required: true });
    t.string('endDateTime');
  },
});

export const HealthScore = objectType({
  name: 'HealthScore',
  definition(t) {
    t.float('score');
    t.int('negativeResponseCount');
    t.int('nrVotes');
  },
});

