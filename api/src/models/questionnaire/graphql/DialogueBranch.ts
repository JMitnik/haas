import { objectType } from '@nexus/schema';

import { EdgeType } from '../../edge/Edge';
import { QuestionNodeType } from '../../QuestionNode/QuestionNode';

export const DialogueBranchSummaryType = objectType({
  name: 'DialogueBranchSummaryType',
  description: 'Summar of a branch in the dialogue.',

  definition(t) {
    t.int('countEntries');
  }
});

export const DialogueBranchType = objectType({
  name: 'DialogueBranchType',
  description: 'Branch in the dialogue.',

  definition(t) {
    t.list.field('nodes', { type: QuestionNodeType });
    t.list.field('edges', { type: EdgeType });
  }
});
