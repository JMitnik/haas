import { objectType } from '@nexus/schema';

export const QuestionNodeSummaryType = objectType({
  name: 'QuestionNodeSummaryType',

  definition(t) {
    t.int('nrEntries', { nullable: true });
    t.float('visitRate', { nullable: true });
  }
});
