import { GraphQLYogaError } from '@graphql-yoga/node';
import { ActionRequestFilterInput } from '../../ActionRequest/graphql';
import { inputObjectType, queryField } from 'nexus';
import { IssueModel } from './IssueModel.graphql'

export const GetIssueResolverInput = inputObjectType({
  name: 'GetIssueResolverInput',
  definition(t) {
    t.string('workspaceId');
    t.string('issueId');
    t.string('topicId');
  },
})

export const GetIssueResolver = queryField('issue', {
  type: IssueModel,
  nullable: true,
  args: {
    input: GetIssueResolverInput,
    actionableFilter: ActionRequestFilterInput,
  },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input provided!');

    return ctx.services.issueService.findIssueById(args.input);
  },
})