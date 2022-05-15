import { objectType } from '@nexus/schema';

export const BasicStatistics = objectType({
  name: 'BasicStatistics',
  description: 'Basic statistics for a general statistics',

  definition(t) {
    t.int('responseCount', { description: 'Number of responses' });

    t.float('average', { description: 'Average value of summarizable statistic' });
  },
});
