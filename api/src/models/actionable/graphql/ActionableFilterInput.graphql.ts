import { inputObjectType } from 'nexus';

export const ActionableFilterInput = inputObjectType({
  name: 'ActionableFilterInput',
  definition(t) {
    t.dateString('startDate');
    t.dateString('endDate');
    t.string('assigneeId');
    t.boolean('withFollowUpAction');
    t.field('status', {
      type: 'ActionableState',
    });
  },
})