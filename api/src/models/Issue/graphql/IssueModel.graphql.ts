import { objectType } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';
import _, { groupBy } from 'lodash';

import { Topic } from '../../Topic/graphql';
import { ActionRequestType } from '../../ActionRequest/graphql/ActionRequest.graphql';
import { ActionableStatistics } from './ActionableStats.graphql';
import { IssueWithActionables } from '../Issue.types';
import { ActionRequestConnection, ActionRequestConnectionFilterInput, ActionRequestFilterInput } from '../../ActionRequest/graphql';


export const IssueModel = objectType({
  name: 'IssueModel',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');
    t.nonNull.string('topicId');
    t.nonNull.string('workspaceId');

    t.nonNull.field('topic', {
      type: Topic,
    });

    t.nonNull.int('teamCount', {
      description: 'Number of different teams issue exists for',
      async resolve(parent, _, ctx) {
        let issue: IssueWithActionables
        if ((parent as any)?.actionRequests?.length) {
          issue = parent as any;
        } else {
          issue = await ctx.services.issueService.findIssueById(
            { issueId: parent.id as string }
          ) as IssueWithActionables;
        }

        const teamCount = groupBy(issue.actionRequests, (actionable) => actionable.dialogueId);
        return Object.keys(teamCount)?.length || 0;
      },
    });

    t.field('basicStats', {
      type: ActionableStatistics,
      async resolve(parent, args, ctx) {
        let issue: IssueWithActionables
        if ((parent as any)?.actionRequests?.length) {
          issue = parent as any;
        } else {
          issue = await ctx.services.issueService.findIssueById(
            { issueId: parent.id as string }
          ) as IssueWithActionables;
        }
        return {
          average: _.meanBy(issue.actionRequests, (actionable) => actionable.session?.mainScore),
          responseCount: issue.actionRequests?.length || 0,
          urgentCount: _.filter(issue.actionRequests, (actionable) => actionable.isVerified)?.length,
        }
      },
    });

    t.field('actionRequestConnection', {
      type: ActionRequestConnection,
      args: {
        input: ActionRequestConnectionFilterInput,
      },
      async resolve(parent, args, ctx) {
        return ctx.services.actionRequestService.findPaginatedActionables(parent.id as string, args.input || undefined);
      },
    });

    t.nonNull.list.field('actionRequests', {
      args: {
        input: ActionRequestFilterInput,
      },
      async resolve(parent, args, ctx) {
        const issueId = parent.id;

        if (!issueId) throw new GraphQLYogaError('No Issue id found for actionable!');

        if (!args.input) {
          return (parent as any)?.actionRequests || [];
        }

        return ctx.services.actionRequestService.findActionablesByIssueId(issueId, args.input) || [];
      },
      type: ActionRequestType,
    });
  },
})