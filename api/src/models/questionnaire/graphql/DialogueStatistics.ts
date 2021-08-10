import { UserInputError } from 'apollo-server-express';
import { CustomerType } from '../../customer';
import { QuestionNodeType } from '../../QuestionNode';
import { inputObjectType, objectType, enumType } from '@nexus/schema';


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
});

export const DialogueStatisticsSummaryGroupbyEnum = enumType({
  name: 'DialogueStatisticsSummaryGroupby',
  members: ['hour', 'day', 'week']
});

export const DialogueStatisticsSummaryFilterInput = inputObjectType({
  name: 'DialogueStatisticsSummaryFilterInput',

  definition(t) {
    t.date('startDate', { required: false });
    t.date('endDate', { required: false });
    t.field('groupBy', { type: DialogueStatisticsSummaryGroupbyEnum });
  }
});

export const DialogueStatisticsSessionsSummaryType = objectType({
  name: 'DialogueStatisticsSessionsSummaryType',

  definition(t) {
    t.int('count');
    t.float('average');
    t.float('min');
    t.float('max');
  }
});

export const DialogueChoiceSummaryType = objectType({
  name: 'DialogueChoiceSummaryType',

  definition(t) {
    t.string('choiceValue');
    t.float('averageValue');
    t.int('count');
    t.float('min');
    t.float('max');
  }
});

export const DialogueStatisticsSummaryGroupType = objectType({
  name: 'DialogueStatisticsSummaryGroupType',

  definition(t) {
    t.date('startDate');
    t.date('endDate');
    t.field('sessionsSummary', { type: DialogueStatisticsSessionsSummaryType, nullable: true });
    t.list.field('choicesSummaries', { type: DialogueChoiceSummaryType, nullable: true });
  }
});

export const DialogueStatisticsSummaryType = objectType({
  name: 'DialogueStatisticsSummaryType',

  definition(t) {
    t.list.field('summaryGroups', { type: DialogueStatisticsSummaryGroupType });
  }
});

export const DialogueStatistics = objectType({
  name: 'DialogueStatistics',

  definition(t) {
    t.id('dialogueId');
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

    // t.field('branch', {
    //   args: { min: 'Int', max: 'Int', dialogueId: 'ID' },
    //   type: DialogueRootBranchStatisticsType,
    //   resolve: (parent, args, ctx, info) => {
    //     const { dialogueSlug, customerSlug } = info.variableValues;

    //     if (!args.dialogueId) {
    //       throw new UserInputError('Currently we do not support without passing in both slugs')
    //     }

    //     return ctx.services.dialogueStatisticsService.getNodeStatisticsByRootBranch(
    //       args.dialogueId,
    //       args.min || 0,
    //       args.max || 30
    //     );
    //   }
    // });

    t.list.field('history', {
      nullable: true,
      type: DialgoueStatisticsLineChartDataType,
    });

    t.field('statisticsSummaries', {
      nullable: true,
      type: DialogueStatisticsSummaryType,
      args: { filter: DialogueStatisticsSummaryFilterInput },
      resolve: (parent, args, ctx) => {
        return ctx.services.dialogueStatisticsService.getDialogueStatisticsSummary(
          parent.dialogueId,
          args.filter || undefined
        );
      }
    });
  },
});
