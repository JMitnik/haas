import { objectType } from 'nexus';

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
    t.nonNull.string('dialogueId', {
      resolve(parent: any) {
        if (parent?.dialogue) return parent?.dialogue?.id;
        return '';
      },
    });

    t.field('dialogue', {
      type: Dialogue,
      nullable: true,
      resolve: async (parent: any, _, { services }) => services.dialogueService.getDialogueById(parent?.dialogueId),
    });

    /** An issue might have a history over time (rising / falling) */
    t.nonNull.field('history', {
      type: DateHistogram,
      resolve(parent: any) {
        return parent?.history;
      },
    });

    /** Basic statistics (such as average/total count) */
    t.nonNull.field('basicStats', {
      type: BasicStatistics,
      resolve(parent: any) {
        return parent?.basicStats;
      },
    });

    /** The status of the current issue. */
    t.nonNull.field('status', {
      type: StatusType,
      resolve(parent: any) {
        return parent?.status;
      },
    });

    t.field('followUpAction', { type: SessionActionType });
    t.nonNull.int('actionRequiredCount', {
      description: 'Number of actions required',
      resolve(parent: any) {
        return parent?.actionRequiredCount;
      },
    });

    /** Timestamps */
    t.date('createdAt');
    t.date('updatedAt');
  },
})
