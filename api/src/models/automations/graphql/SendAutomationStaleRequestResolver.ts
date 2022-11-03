import { inputObjectType, mutationField, nonNull } from 'nexus';

export const SendStaleRequestReminderInput = inputObjectType({
  name: 'SendStaleRequestReminderInput',
  definition(t) {
    t.string('workspaceId', { required: true });
    t.string('automationActionId', { required: true });
    t.nonNull.int('daysNoAction');
  },
});

export const SendStaleRequestReminderResolver = mutationField('sendStaleRequestReminder', {
  type: 'Boolean',
  args: {
    input: nonNull(SendStaleRequestReminderInput),
  },
  nullable: true,
  resolve: async (parent, args, ctx) => {
    return ctx.services.automationActionService.sendStaleRequestReminder(
      args.input.workspaceId, args.input.automationActionId, args.input.daysNoAction
    );
  },
});

export default [
  SendStaleRequestReminderInput,
  SendStaleRequestReminderResolver,
];
