import { inputObjectType, queryField, nonNull } from 'nexus';
import { ActionRequestType } from './ActionRequest.graphql';

export const GetActionRequestInput = inputObjectType({
  name: 'GetActionRequestInput',
  definition(t) {
    t.nonNull.string('workspaceId');
    t.nonNull.string('actionRequestId');
  },
})

export const GetActionRequest = queryField('getActionRequest', {
  type: ActionRequestType,
  nullable: true,
  args: {
    input: nonNull(GetActionRequestInput),
  },
  async resolve(_, args, ctx) {
    const result = await ctx.services.actionRequestService.getActionRequest(args.input.actionRequestId);
    console.dir(result);
    return result;
  },
})