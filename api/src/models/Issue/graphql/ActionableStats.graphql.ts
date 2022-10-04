import { objectType } from 'nexus';

export const ActionableStatistics = objectType({
  name: 'ActionableStatistics',
  description: 'Basic statistics for actionRequests of an issue',

  definition(t) {
    t.nonNull.int('responseCount', { description: 'Number of responses' });
    t.nonNull.float('average', { description: 'Average value of summarizable statistic' });
    t.nonNull.int('urgentCount', { description: 'Number of urgent actionRequests ' });
  },
});
