import { enumType, extendType, inputObjectType, objectType, plugin } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { DialogueType } from './Dialogue'

export const DialogueImpactScoreType = enumType({
  name: 'DialogueImpactScoreType',
  members: ['AVERAGE'],
});

export const DialogueStatisticsSummaryModel = objectType({
  name: 'DialogueStatisticsSummaryModel',
  description: 'DialogueStatisticsSummary',
  definition(t) {
    t.id('id');
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

    t.field('dialogue', { type: DialogueType, nullable: true });
  },
});
