import { mutationField, nonNull } from 'nexus';
import { CreateUserTourInput } from './CreateUserTourInput.graphql';

export const CreateAndDispatchUserTour = mutationField('createAndDispatchUserTour', {
  type: 'UserTour',
  nullable: true,
  args: { input: nonNull(CreateUserTourInput) },
  async resolve(parent, args, ctx) {
    return ctx.services.userTourService.createAndDispatchUserTour(args.input);
  },
})