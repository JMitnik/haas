import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionRequestType } from './ActionRequest.graphql';

export const VerifyActionRequestInput = inputObjectType({
  name: 'VerifyActionRequestInput',
  definition(t) {
    t.nonNull.string('workspaceId');
    t.nonNull.string('actionRequestId');
  },
})

export const VerifyActionRequestMutation = mutationField('verifyActionRequest', {
  type: ActionRequestType,
  nullable: true,
  args: {
    input: nonNull(VerifyActionRequestInput),
  },
  async resolve(_, args, ctx) {
    return ctx.services.actionRequestService.verifyActionRequest(args.input);
  },
})