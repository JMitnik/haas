import { inputObjectType, objectType } from 'nexus';

import { TopicFilterInput } from '../Topic/graphql/TopicFilterInput';
import { SessionType } from '../session/graphql';
import { DialogueImpactScoreType } from './DialogueStatisticsSummary';

export const DialogueStatisticsSummaryFilterInput = inputObjectType({
  name: 'DialogueStatisticsSummaryFilterInput',
  definition(t) {
    t.string('startDateTime', { required: true });
    t.string('endDateTime');
    t.boolean('refresh');
    t.field('impactType', {
      type: DialogueImpactScoreType,
      required: true,
    });

    t.field('topicsFilter', { type: TopicFilterInput, required: false });
    t.int('cutoff');
  },
})

export const TopicType = objectType({
  name: 'TopicType',
  definition(t) {
    t.nonNull.string('name');
    t.float('impactScore');
    t.int('nrVotes');

    t.field('subTopics', {
      list: true,
      nullable: true,
      type: TopicType,
    });

    t.field('basicStats', {
      type: 'BasicStatistics',
      nullable: true,
    });
  },
});

export const PathedSessionsType = objectType({
  name: 'PathedSessionsType',
  definition(t) {
    t.string('startDateTime');
    t.string('endDateTime');

    t.list.string('path');
    t.list.field('pathedSessions', {
      type: SessionType,
    });
  },
})

export const TopicInputType = inputObjectType({
  name: 'TopicInputType',
  definition(t) {
    t.boolean('isRoot', { default: false });
    t.string('value', { required: true });
    t.field('impactScoreType', {
      type: DialogueImpactScoreType,
      required: true,
    });
    t.string('startDateTime', { required: true });
    t.string('endDateTime');
    t.boolean('refresh', { required: false });
  },
});

export const PathedSessionsInput = inputObjectType({
  name: 'PathedSessionsInput',
  definition(t) {
    t.list.string('path', { required: true });
    t.string('startDateTime', { required: true });
    t.string('endDateTime');
    t.boolean('issueOnly');
    t.boolean('refresh', { default: false });
  },
});

export const MostTrendingTopic = objectType({
  name: 'MostTrendingTopic',
  definition(t) {
    t.list.string('path');
    t.int('nrVotes');
    t.string('group');
    t.float('impactScore');
  },
});

export const PathTopic = objectType({
  name: 'PathTopic',
  definition(t) {
    t.int('nrVotes');
    t.int('depth');
    t.string('topic');
    t.float('impactScore');
  },
});

export const MostPopularPath = objectType({
  name: 'MostPopularPath',
  definition(t) {
    t.list.field('path', {
      type: PathTopic,
    });
    t.string('group');
  },
});

export const TopicDelta = objectType({
  name: 'TopicDelta',
  definition(t) {
    t.string('topic');
    t.int('nrVotes');
    t.float('averageCurrent');
    t.float('averagePrevious');
    t.float('delta');
    t.float('percentageChanged');
    t.string('group', { nullable: true });
  },
})

export const MostChangedPath = objectType({
  name: 'MostChangedPath',
  definition(t) {
    t.string('group', { nullable: true });
    t.list.field('topPositiveChanged', {
      type: TopicDelta,
    });
    t.list.field('topNegativeChanged', {
      type: TopicDelta,
    });
  },
});
