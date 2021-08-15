import { QuestionNodeType } from '../../QuestionNode';
import { inputObjectType, objectType, enumType } from '@nexus/schema';
import { EdgeType } from '../../edge/Edge';


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

export const DialoguePathSummaryType = objectType({
  name: 'DialoguePathSummaryType',

  definition(t) {
    t.int('countEntries');
    t.int('averageValue');
    t.int('minValue');
    t.int('maxValue');
  }
});

export const DialoguePathType = objectType({
  name: 'DialoguePathType',
  description: 'A generic path in a dialogue, from root to end.',

  definition(t) {
    t.field('dialoguePathSummary', { type: DialoguePathSummaryType });
    t.list.field('nodes', { type: QuestionNodeType });
    t.list.field('edges', { type: EdgeType });
  }
});

export const DialoguePathsSummaryType = objectType({
  name: 'DialoguePathsSummaryType',
  description: 'Summary of a dialogue\'s dialogue-paths.',

  definition(t) {
    t.field('mostPopularPath', { type: DialoguePathType, nullable: true });
    t.field('mostCriticalPath', { type: DialoguePathType, nullable: true });
  }
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
  }
});

export const DialogueStatisticsSessionsSummaryType = objectType({
  name: 'DialogueStatisticsSessionsSummaryType',

  definition(t) {
    t.date('startDate');
    t.date('endDate');
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

export const DialogueStatisticsSummaryType = objectType({
  name: 'DialogueStatisticsSummaryType',

  definition(t) {
    t.field('pathsSummary', { type: DialoguePathsSummaryType, nullable: true });
    t.field('branchesSummary', { type: DialoguePathsSummaryType, nullable: true });

    t.list.field('sessionsSummaries', {
      type: DialogueStatisticsSessionsSummaryType,
      nullable: true,
      args: { groupBy: DialogueStatisticsSummaryGroupbyEnum }
    });

    t.list.field('choicesSummaries', { type: DialogueChoiceSummaryType, nullable: true });
  }
});

export const DialogueStatistics = objectType({
  name: 'DialogueStatistics',

  definition(t) {
    t.id('dialogueId');
    t.int('nrInteractions');

    t.field('statisticsSummary', {
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

    t.list.field('topPositivePath', {
      type: DialogueStatisticsTopPathType,
      nullable: true,
      deprecation: 'This field is deprecated',
    });

    t.list.field('topNegativePath', {
      type: DialogueStatisticsTopPathType,
      nullable: true,
      deprecation: 'This field is deprecated',
    });

    t.field('mostPopularPath', {
      type: DialogueStatisticsTopPathType,
      nullable: true,
      deprecation: 'This field is deprecated',
    });

    t.list.field('history', {
      nullable: true,
      type: DialgoueStatisticsLineChartDataType,
      deprecation: 'This field is deprecated',
    });
  },
});
