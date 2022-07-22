import { mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

export const ResetWorkspaceDataMutation = mutationField('resetWorkspaceData', {
  type: 'Boolean',
  args: { workspaceId: 'String' },
  async resolve(_, args, ctx) {
    if (!args.workspaceId) throw new UserInputError('No workspaceId provided');

    return ctx.services.generateWorkspaceService.resetWorkspaceData(args.workspaceId);
  },
});
