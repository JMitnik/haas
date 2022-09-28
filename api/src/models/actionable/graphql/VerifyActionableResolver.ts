import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionableType } from './Actionable.graphql';

export const VerifyActionableInput = inputObjectType({
  name: 'VerifyActionableInput',
  definition(t) {
    t.nonNull.string('workspaceId');
    t.nonNull.string('actionableId');
  },
})

export const VerifyActionableMutation = mutationField('verifyActionable', {
  type: ActionableType,
  nullable: true,
  args: {
    input: nonNull(VerifyActionableInput),
  },
  async resolve(_, args, ctx) {
    return ctx.services.actionableService.verifyActionable(args.input);
  },
})