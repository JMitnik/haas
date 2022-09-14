import { objectType } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';
import _, { groupBy } from 'lodash';

import { Topic } from '../../Topic/graphql';
import { ActionableType } from '../../actionable/graphql/Actionable.graphql';
import { ActionableStatistics } from './ActionableStats.graphql';
import { ActionableValidator } from '../../actionable/ActionableValidator';
import { ActionableFilterInput } from '../../actionable/Actionable.types';
import { IssueWithActionables } from '../Issue.types';


export const IssueModel = objectType({
  name: 'IssueModel',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');
    t.nonNull.string('topicId');

    t.nonNull.field('topic', {
      type: Topic,
    });

    t.nonNull.int('teamCount', {
      description: 'Number of different teams issue exists for',
      async resolve(parent, _, ctx) {
        let issue: IssueWithActionables
        if ((parent as any)?.actionables?.length) {
          issue = parent as any;
        } else {
          issue = await ctx.services.issueService.findIssueById(
            { issueId: parent.id as string }
          ) as IssueWithActionables;
        }

        const teamCount = groupBy(issue.actionables, (actionable) => actionable.dialogueId);
        return Object.keys(teamCount)?.length || 0;
      },
    });

    t.field('basicStats', {
      type: ActionableStatistics,
      async resolve(parent, args, ctx) {
        let issue: IssueWithActionables
        if ((parent as any)?.actionables?.length) {
          issue = parent as any;
        } else {
          issue = await ctx.services.issueService.findIssueById(
            { issueId: parent.id as string }
          ) as IssueWithActionables;
        }
        return {
          average: _.meanBy(issue.actionables, (actionable) => actionable.session?.mainScore),
          responseCount: issue.actionables?.length || 0,
          urgentCount: _.filter(issue.actionables, (actionable) => actionable.isUrgent)?.length,
        }
      },
    });

    t.nonNull.list.field('actionables', {
      args: {
        input: 'ActionableFilterInput',
      },
      async resolve(parent, args, ctx) {
        const issueId = parent.id;

        if (!issueId) throw new GraphQLYogaError('No Issue id found for actionable!');

        if (!args.input) {
          console.dir((parent as any)?.actionables?.map((actionable: any) => actionable.session.nodeEntries.length));
          return (parent as any)?.actionables || [];
        }

        return ctx.services.actionableService.findActionablesByIssueId(issueId, args.input) || [];
      },
      type: ActionableType,
    });
  },
})