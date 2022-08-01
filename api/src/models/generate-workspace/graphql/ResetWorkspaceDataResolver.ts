import { mutationField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const ResetWorkspaceDataMutation = mutationField('resetWorkspaceData', {
  type: 'Boolean',
  args: { workspaceId: 'String' },
  async resolve(_, args, ctx) {
    if (!args.workspaceId) throw new GraphQLYogaError('No workspaceId provided');

    return ctx.services.generateWorkspaceService.resetWorkspaceData(args.workspaceId);
  },
});
