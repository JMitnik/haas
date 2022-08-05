import { mutationField } from 'nexus';
import { UserInputError } from 'apollo-server-express';
import { assertNonNullish } from '../../../utils/assertNonNullish';

export const ResetWorkspaceDataMutation = mutationField('resetWorkspaceData', {
  type: 'Boolean',
  args: { workspaceId: 'String' },
  async resolve(_, args, ctx) {
    if (!args.workspaceId) throw new UserInputError('No workspaceId provided');

    assertNonNullish(ctx.session?.user?.id, 'No User ID provided!');

    return ctx.services.generateWorkspaceService.resetWorkspaceData(args.workspaceId, ctx.session.user.id);
  },
});
