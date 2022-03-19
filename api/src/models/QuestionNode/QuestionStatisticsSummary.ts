import { enumType, objectType } from '@nexus/schema';

export const QuestionImpactScoreType = enumType({
  name: 'QuestionImpactScoreType',
  members: ['PERCENTAGE'],
});

export const QuestionStatisticsScores = objectType({
  name: 'QuestionStatisticsScores',
  definition(t) {
    t.int('nrVotes', {
      nullable: true,
    });
    t.float('impactScore', {
      nullable: true,
    });
    t.string('option');
  },
});

export const QuestionStatisticsSummary = objectType({
  name: 'QuestionStatisticsSummary',
  definition(t) {
    t.id('id', { nullable: true });
    t.string('dialogueId', { nullable: true });

    t.date('updatedAt', { nullable: true });
    t.date('startDateTime', { nullable: true });
    t.date('endDateTime', { nullable: true });

    t.field('impactScores', {
      type: QuestionStatisticsScores,
      list: true,
    });

  },
});