import { inputObjectType } from 'nexus';

export const CreateUserTourInput = inputObjectType({
  name: 'CreateUserTourInput',
  definition(t) {
    t.string('id');
    t.nonNull.field('type', {
      type: 'TourType',
    });
    t.string('triggerPage');
    t.string('triggerVersion');
    t.nonNull.list.field('steps', {
      type: 'CreateTourStepInput',
    });
  },
})