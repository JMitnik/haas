import { mutationField, nonNull } from 'nexus';
import { assertNonNullish } from '../../../utils/assertNonNullish';
import { FinishTourOfUserInput } from './FinishTourOfUserInput.graphql';

export const FinishTourOfUser = mutationField('finishTourOfUser', {
  type: 'TourOfUser',
  nullable: true,
  args: { input: nonNull(FinishTourOfUserInput) },
  async resolve(parent, args, ctx) {

    assertNonNullish(ctx.session?.user?.id, 'no user found!');

    return ctx.services.userTourService.finishTourOfUser(
      args.input.userTourId,
      ctx.session.user.id
    );
  },
})