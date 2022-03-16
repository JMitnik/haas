import { enumType, extendType, inputObjectType, objectType, plugin } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { DialogueType } from './Dialogue'

export const DialogueImpactScore = enumType({
  name: 'DialogueImpactScore',
  members: ['AVERAGE'],
});

export const DialogueStatisticsSummaryModel = objectType({
  name: 'DialogueStatisticsSummaryModel',
  description: 'DialogueStatisticsSummary',
  definition(t) {
    t.id('id', { nullable: true });
    t.date('updatedAt', { nullable: true });

    t.int('nrVotes');
    t.float('impactScore', {
      args: {
        type: 'DialogueImpactScore',
      },
      nullable: true,
      useParentResolve: true,
      resolve: (parent, args, ctx) => {
        if (!args.type) throw new UserInputError('No impact score type provided!');

        return ctx.services.dialogueStatisticsService.calculateImpactScore(args.type, parent.sessions);
      },
    });

    t.field('sessions', { type: 'Session', list: true });

    t.field('dialogue', { type: DialogueType, nullable: true });
  },
});
