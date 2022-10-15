import { mutationField, nonNull } from 'nexus';
import { assertNonNullish } from '../../../utils/assertNonNullish';
import { CreateUserTourInput } from './CreateUserTourInput.graphql';

export const UpdateUserTour = mutationField('updateUserTour', {
  type: 'UserTour',
  nullable: true,
  args: { input: nonNull(CreateUserTourInput) },
  async resolve(parent, args, ctx) {
    assertNonNullish(args.input.id, 'No ID provided for user tour!');

    return ctx.services.userTourService.updateUserTour(args.input.id, args.input);
  },
})