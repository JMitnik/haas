import { inputObjectType } from 'nexus';

export const FinishTourOfUserInput = inputObjectType({
  name: 'FinishTourOfUserInput',
  definition(t) {
    t.nonNull.string('userTourId');
    t.nonNull.string('userId');
  },
})