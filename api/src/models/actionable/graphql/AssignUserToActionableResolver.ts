import { inputObjectType, mutationField, nonNull } from 'nexus';
import { ActionableType } from './Actionable.graphql';

export const AssignUserToActionableInput = inputObjectType({
  name: 'AssignUserToActionableInput',
  definition(t) {
    t.string('assigneeId');
    t.nonNull.string('actionableId');
  },
})

export const AssignUserToActionable = mutationField('assignUserToActionable', {
  type: ActionableType,
  nullable: true,
  args: {
    input: nonNull(AssignUserToActionableInput),
  },
  async resolve(_, args, ctx) {
    return ctx.services.actionableService.assignUserToActionable(args.input);
  },
})