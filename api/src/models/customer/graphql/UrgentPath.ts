import { objectType } from 'nexus';

import { BasicStatistics } from './BasicStatistics';
import { Path } from '../../questionnaire/graphql/Path';

export const UrgentPath = objectType({
  name: 'UrgentPath',
  description: `
    An urgent path is a path which was considered urgent. It currently follows a simple heuristic:
    1. Get all sessions of the workspace.
    2. Find sessions with a score below 4. If there is no such session, then no urgency is reported.
    3. Find the topic that has the most negative responses.
  `,

  definition(t) {
    t.id('id');

    t.field('path', { type: Path });

    t.nonNull.string('dialogueId');

    t.field('dialogue', {
      type: 'Dialogue',
      nullable: true,

      resolve: async (parent, args, ctx) => (
        ctx.services.dialogueService.getDialogueById(parent.dialogueId)
      ),
    });

    t.field('basicStats', { type: BasicStatistics });
  },
});
