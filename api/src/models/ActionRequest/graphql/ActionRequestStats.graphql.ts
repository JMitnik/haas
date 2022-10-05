import { objectType } from 'nexus';

export const ActionRequestStatistics = objectType({
  name: 'ActionRequestStatistics',
  description: 'Basic statistics for action requests of an issue',

  definition(t) {
    t.nonNull.int('responseCount', { description: 'Number of responses' });
    t.nonNull.float('average', { description: 'Average value of summarizable statistic' });
    t.nonNull.int('urgentCount', { description: 'Number of urgent actionRequests ' });
  },
});
