import { objectType } from 'nexus';
import { Topic } from '../../Topic/graphql';
import { ActionableType } from '../../actionable/graphql/Actionable.graphql';
import { ActionableValidator } from '../../actionable/ActionableValidator';
import { ActionableFilterInput } from '../../actionable/Actionable.types';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const IssueModel = objectType({
  name: 'IssueModel',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');
    t.string('topicId');

    t.field('topic', {
      type: Topic,
    });

    t.list.field('actionables', {
      args: {
        input: 'ActionableFilterInput',
      },
      async resolve(parent, args, ctx) {
        const issueId = parent.id;

        if (!issueId) throw new GraphQLYogaError('No Issue id found for actionable!');

        if (!args.input) {
          return (parent as any)?.actionables || [];
        }

        return ctx.services.actionableService.findActionablesByIssueId(issueId, args.input) || [];
      },
      type: ActionableType,
    });
  },
})