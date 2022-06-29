import { objectType } from '@nexus/schema';

import { StatusType } from '../../Common/Status/graphql';
import { DateHistogram } from '../../Common/Analytics/graphql/DateHistogram.graphql';
import { BasicStatistics } from '../../customer';
import { DialogueType as Dialogue } from '../../questionnaire/Dialogue';
import { SessionActionType } from '../../session/graphql/SesssionActionType.graphql';

export const Issue = objectType({
  name: 'Issue',
  description: `
    An issue is a problem that has been identified.

    Typically, an issue is a combination of a particulat topic and a specific dialogue.
  `,

  definition(t) {
    t.id('id');

    t.float('rankScore');

    /** An issue regards a particular topic.  */
    t.string('topic');

    /** Each issue has an associated dialogue  */
    t.string('dialogueId');
    t.field('dialogue', {
      type: Dialogue,
      nullable: true,
      resolve: async ({ dialogueId }, _, { services }) => services.dialogueService.getDialogueById(dialogueId),
    });

    /** An issue might have a history over time (rising / falling) */
    t.field('history', { type: DateHistogram });

    /** Basic statistics (such as average/total count) */
    t.field('basicStats', { type: BasicStatistics });

    /** The status of the current issue. */
    t.field('status', { type: StatusType });

    t.field('followUpAction', { type: SessionActionType, nullable: true });

    /** Timestamps */
    t.date('createdAt');
    t.date('updatedAt');
  },
})
