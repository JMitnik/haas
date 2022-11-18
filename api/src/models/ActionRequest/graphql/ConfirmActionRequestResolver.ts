import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionRequestType } from './ActionRequest.graphql';

export const ConfirmActionRequestInput = inputObjectType({
  name: 'ConfirmActionRequestInput',
  definition(t) {
    t.nonNull.string('workspaceId');
    t.boolean('agree');
    t.nonNull.string('actionRequestId');
  },
})

export const ConfirmActionRequest = mutationField('confirmActionRequest', {
  type: ActionRequestType,
  nullable: true,
  args: {
    input: nonNull(ConfirmActionRequestInput),
  },
  async resolve(_, args, ctx) {
    console.log(args.input);
    if (typeof args.input.agree === undefined) return null;

    return ctx.services.actionRequestService.confirmActionRequest(args.input);
  },
})