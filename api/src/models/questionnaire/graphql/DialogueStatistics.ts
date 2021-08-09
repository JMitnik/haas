import { objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { CustomerType } from '../../customer';
import { QuestionNodeType } from '../../QuestionNode';


export const DialgoueStatisticsLineChartDataType = objectType({
  name: 'lineChartDataType',

  definition(t) {
    t.string('x', { nullable: true });
    t.int('y', { nullable: true });
    t.string('entryId', { nullable: true });
  },
});

export const DialogueStatisticsTopPathType = objectType({
  name: 'topPathType',

  definition(t) {
    t.string('answer', { nullable: true });
    t.int('quantity', { nullable: true });
    t.string('basicSentiment', { nullable: true });
  },
});

export const DialogueRootBranchStatisticsType = objectType({
  name: 'DialogueRootBranchStatisticsType',

  definition(t) {
    t.list.field('nodes', { type: QuestionNodeType, nullable: true });
  }
})

export const DialogueStatistics = objectType({
  name: 'DialogueStatistics',

  definition(t) {
    t.int('nrInteractions');

    t.list.field('topPositivePath', {
      type: DialogueStatisticsTopPathType,
      nullable: true,
    });

    t.list.field('topNegativePath', {
      type: DialogueStatisticsTopPathType,
      nullable: true,
    });

    t.field('mostPopularPath', {
      type: DialogueStatisticsTopPathType,
      nullable: true,
    });

    t.field('branch', {
      args: { min: 'Int', max: 'Int', dialogueId: 'ID' },
      type: DialogueRootBranchStatisticsType,
      resolve: (parent, args, ctx, info) => {
        const { dialogueSlug, customerSlug } = info.variableValues;

        if (!args.dialogueId) {
          throw new UserInputError('Currently we do not support without passing in both slugs')
        }

        return ctx.services.dialogueStatisticsService.getNodeStatisticsByRootBranch(
          args.dialogueId,
          args.min || 0,
          args.max || 30
        );
      }
    });

    t.list.field('history', {
      nullable: true,
      type: DialgoueStatisticsLineChartDataType,
    });
  },
});
