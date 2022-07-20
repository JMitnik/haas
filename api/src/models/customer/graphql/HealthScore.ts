import { inputObjectType, objectType } from 'nexus';
import { TopicFilterInput } from '../../Topic/graphql';

export const HealthScoreInput = inputObjectType({
  name: 'HealthScoreInput',
  definition(t) {
    t.float('threshold', { default: 70 });
    t.string('startDateTime', { required: true });
    t.string('endDateTime');

    t.field('topicFilter', { type: TopicFilterInput });
  },
});

export const HealthScore = objectType({
  name: 'HealthScore',
  definition(t) {
    t.nonNull.float('score');
    t.nonNull.int('negativeResponseCount');
    t.nonNull.int('nrVotes');
  },
});

