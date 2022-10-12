import { mutationField, nonNull } from 'nexus';
import { FinishTourOfUserInput } from './FinishTourOfUserInput.graphql';

export const FinishTourOfUser = mutationField('finishTourOfUser', {
  type: 'TourOfUser',
  nullable: true,
  args: { input: nonNull(FinishTourOfUserInput) },
  async resolve(parent, args, ctx) {
    return null;
  },
})