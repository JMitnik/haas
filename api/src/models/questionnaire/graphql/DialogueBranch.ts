import { objectType } from '@nexus/schema';

import { EdgeType } from '../../edge/Edge';
import { QuestionNodeType } from '../../QuestionNode/QuestionNode';

export const DialogueBranchSummaryType = objectType({
  name: 'DialogueBranchSummaryType',
  description: 'Summary of a branch in the dialogue.',

  definition(t) {
    t.int('countEntries');
  }
});

export const DialogueBranchType = objectType({
  name: 'DialogueBranchType',
  description: 'Branch in the dialogue.',

  definition(t) {
    t.field('branchSummary', { type: DialogueBranchSummaryType, nullable: true });
    t.list.field('nodes', { type: QuestionNodeType });
    t.list.field('edges', { type: EdgeType });
  }
});

export const DialogueBranchesSummaryType = objectType({
  name: 'DialogueBranchesSummaryType',
  description: 'Summary of all branches',

  definition(t) {
    t.field('positiveBranch', { type: DialogueBranchType, nullable: true });
    t.field('neutralBranch', { type: DialogueBranchType, nullable: true });
    t.field('negativeBranch', { type: DialogueBranchType, nullable: true });
  }
})
