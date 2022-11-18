import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionRequestType } from './ActionRequest.graphql';
import { ActionRequestState } from './ActionRequestState.graphql';

export const SetActionRequestStatusInput = inputObjectType({
  name: 'SetActionRequestStatusInput',
  definition(t) {
    t.nonNull.field('status', { type: ActionRequestState });
    t.nonNull.string('actionRequestId');
    t.nonNull.string('workspaceId');
    t.string('userId');
  },
})

export const SetActionRequestStatus = mutationField('setActionRequestStatus', {
  type: ActionRequestType,
  nullable: true,
  args: {
    input: nonNull(SetActionRequestStatusInput),
  },
  async resolve(_, args, ctx) {
    return ctx.services.actionRequestService.setActionRequestStatus(args.input);
  },
})