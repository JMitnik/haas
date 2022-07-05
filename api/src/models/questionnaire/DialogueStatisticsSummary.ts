import { enumType, objectType } from '@nexus/schema';
import { DialogueType } from './Dialogue'

export const DialogueImpactScoreType = enumType({
  name: 'DialogueImpactScoreType',
  members: ['AVERAGE'],
});

export const DialogueStatisticsSummaryModel = objectType({
  name: 'DialogueStatisticsSummaryModel',
  description: 'DialogueStatisticsSummary',
  definition(t) {
    t.id('id', { nullable: true });
    t.string('dialogueId');

    t.date('updatedAt', { nullable: true });
    t.date('startDateTime', { nullable: true });
    t.date('endDateTime', { nullable: true });

    t.int('nrVotes', {
      nullable: true,
    });
    t.float('impactScore', {
      nullable: true,
    });

    t.string('title', {
      resolve(parent) {
        return parent.dialogue?.title as string;
      },
    });

    t.field('dialogue', { type: DialogueType, nullable: true });
  },
});
