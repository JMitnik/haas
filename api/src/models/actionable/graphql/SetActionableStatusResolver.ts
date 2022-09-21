import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionableType } from './Actionable.graphql';
import { ActionableState } from './ActionableState.graphql';

export const SetActionableStatusInput = inputObjectType({
  name: 'SetActionableStatusInput',
  definition(t) {
    t.nonNull.field('status', { type: ActionableState });
    t.nonNull.string('actionableId');
    t.nonNull.string('workspaceId');
  },
})

export const SetActionableStatus = mutationField('setActionableStatus', {
  type: ActionableType,
  nullable: true,
  args: {
    input: nonNull(SetActionableStatusInput),
  },
  async resolve(_, args, ctx) {
    return ctx.services.actionableService.setActionableStatus(args.input);
  },
})