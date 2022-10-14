import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionRequestType } from './ActionRequest.graphql';

export const AssignUserToActionRequestInput = inputObjectType({
  name: 'AssignUserToActionRequestInput',
  definition(t) {
    t.nonNull.string('workspaceId');
    t.string('assigneeId');
    t.nonNull.string('actionRequestId');
  },
})

export const AssignUserToActionRequest = mutationField('assignUserToActionRequest', {
  type: ActionRequestType,
  nullable: true,
  args: {
    input: nonNull(AssignUserToActionRequestInput),
  },
  async resolve(_, args, ctx) {
    return ctx.services.actionRequestService.assignUserToActionRequest(args.input);
  },
})