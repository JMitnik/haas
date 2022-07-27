import { objectType } from 'nexus';


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

    t.list.field('history', {
      nullable: true,
      type: DialgoueStatisticsLineChartDataType,
    });
  },
});
