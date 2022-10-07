import { inputObjectType } from 'nexus';
import { ActionRequestState } from './ActionRequestState.graphql';

export const ActionRequestFilterInput = inputObjectType({
  name: 'ActionRequestFilterInput',
  definition(t) {
    t.dateString('startDate');
    t.dateString('endDate');
    t.string('assigneeId');
    t.boolean('withFollowUpAction');
    t.field('status', {
      type: ActionRequestState,
    });
  },
})