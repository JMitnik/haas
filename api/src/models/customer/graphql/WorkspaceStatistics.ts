import { objectType } from 'nexus';
import { UserInputError } from 'apollo-server-express';
import { DialogueImpactScore } from 'prisma/prisma-client';

import { BasicStatistics } from './BasicStatistics';
import {
  DialogueStatisticsSummaryFilterInput,
  MostChangedPath,
  MostPopularPath,
  MostTrendingTopic,
} from '../../questionnaire/DialogueStatisticsResolver';
import { isValidDateTime } from '../../../utils/isValidDate';
import { HealthScore, HealthScoreInput } from './HealthScore';
import { WorkspaceStatisticsValidator } from '../WorkspaceStatisticsValidator';
import { DialogueStatisticsSummaryModel } from '../../../models/questionnaire';
import { assertNonNullish } from '../../../utils/assertNonNullish';
import { DateHistogram } from '../../Common/Analytics/graphql/DateHistogram.graphql';
import { DialogueValidator } from '../../../models/questionnaire/DialogueValidator';

export const WorkspaceStatistics = objectType({
  name: 'WorkspaceStatistics',

  definition(t) {
    // This ID is the same as the ID of the Customer / Workspace
    t.id('id');

    t.nonNull.list.nonNull.field('workspaceStatisticsSummary', {
      type: DialogueStatisticsSummaryModel,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      nullable: true,
      resolve: async (parent, args, ctx) => {
        if (!args.input) throw new UserInputError('Not input object!');
        const { startDateTime, endDateTime } = args.input;
        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (startDateTime) {
          utcStartDateTime = isValidDateTime(startDateTime, 'START_DATE') as Date;
        }

        if (endDateTime) {
          utcEndDateTime = isValidDateTime(endDateTime, 'END_DATE');
        }

        assertNonNullish(utcStartDateTime, 'Provided date range is invalid');
        assertNonNullish(ctx.session?.user?.id, 'No user ID provided');
        assertNonNullish(parent.id, 'No workspace ID available');

        const canAccessAllDialogues = DialogueValidator.canAccessAllDialogues(parent.id, ctx.session);
        const userId = ctx.session.user.id;

        return ctx.services.dialogueStatisticsService.findWorkspaceStatisticsSummary(
          parent.id,
          canAccessAllDialogues,
          userId,
          DialogueImpactScore.AVERAGE,
          utcStartDateTime,
          utcEndDateTime,
        );
      },
    })

    /**
     * Basic stats about the workspace
     */
    t.field('basicStats', {
      type: BasicStatistics,
      args: { input: DialogueStatisticsSummaryFilterInput },
      description: 'Basic statistics of a workspace (e.g. number of responses, average general score, etc)',
      resolve: async (parent, args, ctx) => {
        if (!args.input) throw new UserInputError('Not input object!');
        const { startDateTime, endDateTime } = args.input;
        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (startDateTime) {
          utcStartDateTime = isValidDateTime(startDateTime, 'START_DATE') as Date;
        }

        if (endDateTime) {
          utcEndDateTime = isValidDateTime(endDateTime, 'END_DATE');
        }

        return ctx.services.dialogueStatisticsService.calculateWorkspaceBasicStatistics(
          parent.id || '',
          DialogueImpactScore.AVERAGE,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
        );
      },
    });

    /**
     * Histogram of responses over time.
     */
    t.field('responseHistogram', {
      type: DateHistogram,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      description: 'Histogram of responses over time.',

      resolve: async (parent, args, { services }) => {
        const filter = WorkspaceStatisticsValidator.resolveFilter(args.input);
        return services.workspaceStatisticsService.getResponseHistogram(parent.id || '', filter);
      },
    })

    /**
     * Histogram of issues over time.
     */
    t.field('issueHistogram', {
      type: DateHistogram,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      description: 'Histogram of issues over time.',

      resolve: async (parent, args, { services }) => {
        const filter = WorkspaceStatisticsValidator.resolveFilter(args.input);
        return services.workspaceStatisticsService.getIssueHistogram(parent.id || '', filter);
      },
    })

    /**
     * Topics of a workspace ranked by either impact score or number of responses.
     */
    t.list.field('rankedTopics', {
      type: 'TopicType',
      args: { input: DialogueStatisticsSummaryFilterInput },
      description: 'Topics of a workspace ranked by either impact score or number of responses',

      resolve: async (parent, args, ctx) => {
        if (!args.input) throw new UserInputError('Not input object!');
        const { startDateTime, endDateTime } = args.input;
        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (startDateTime) {
          utcStartDateTime = isValidDateTime(startDateTime, 'START_DATE') as Date;
        }

        if (endDateTime) {
          utcEndDateTime = isValidDateTime(endDateTime, 'END_DATE');
        }

        const topicFilter = args.input.topicsFilter || undefined;

        return ctx.services.dialogueStatisticsService.rankTopics(
          parent.id || '',
          utcStartDateTime as Date,
          utcEndDateTime as Date,
          topicFilter,
          args.input.cutoff || undefined,
        ) as any;
      },
    })

    /**
     * Get the health score of a workspace.
     */
    t.field('health', {
      type: HealthScore,
      args: { input: HealthScoreInput },
      description: 'Gets the health score of the workspace',
      useParentResolve: true,

      resolve: async (parent, args, ctx) => {
        if (!args.input) throw new UserInputError('Not input object!');
        const { startDateTime, endDateTime, threshold } = args.input;
        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (startDateTime) {
          utcStartDateTime = isValidDateTime(startDateTime, 'START_DATE') as Date;
        }

        if (endDateTime) {
          utcEndDateTime = isValidDateTime(endDateTime, 'END_DATE');
        }

        const topicFilter = args.input.topicFilter || undefined;

        assertNonNullish(ctx.session?.user?.id, 'No user ID provided!');
        const canAccessAllDialogues = DialogueValidator.canAccessAllDialogues(parent.id as string, ctx.session);

        return ctx.services.dialogueStatisticsService.findWorkspaceHealthScore(
          parent.id || '',
          ctx.session.user.id,
          utcStartDateTime as Date,
          utcEndDateTime,
          topicFilter,
          threshold || undefined,
          canAccessAllDialogues,
        );
      },
    });

    /**
    * Get the path (sequence of topics) with the most changed impact score.
    */
    t.field('mostChangedPath', {
      type: MostChangedPath,
      args: { input: DialogueStatisticsSummaryFilterInput },
      useParentResolve: true,
      description: `
        Get the path (sequence of topics) with the most changed impact score.
      `,

      resolve: async (parent, args, ctx) => {
        if (!args.input) throw new UserInputError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new UserInputError('No impact type provided dialogue statistics summary!');
        if (args?.input?.cutoff && args.input.cutoff < 1) throw new UserInputError('Cutoff cannot be a negative number!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE') as Date;
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.customerService.findNestedMostChangedPath(
          parent.id || '',
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
          args.input.cutoff || undefined,
        );
      },
    });

    /**
 * Get the path (sequence of topics) with the most changed impact score.
 */
    t.field('mostTrendingTopic', {
      type: MostTrendingTopic,
      nullable: true,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      useParentResolve: true,
      async resolve(parent, args, ctx) {
        if (!args.input) throw new UserInputError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new UserInputError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE');
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.customerService.findNestedMostTrendingTopic(
          parent.id || '',
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
        )
      },
    });

    /**
 * Get the path that has been visited the most by all users.
 */
    t.field('mostPopularPath', {
      type: MostPopularPath,
      nullable: true,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      useParentResolve: true,
      async resolve(parent, args, ctx) {
        if (!args.input) throw new UserInputError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new UserInputError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE') as Date;
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.customerService.findNestedMostPopularPath(
          parent.id || '',
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
        );
      },
    });
  },
})
