import { inputObjectType, mutationField, nonNull } from 'nexus';

export const SendStaleRequestReminderInput = inputObjectType({
  name: 'SendStaleRequestReminderInput',
  definition(t) {
    t.string('workspaceSlug', { required: true });
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
    return ctx.services.automationActionService.sendDialogueLink(
      args.input.workspaceSlug, args.input.automationActionId
    );
  },
});

export default [
  SendStaleRequestReminderInput,
  SendStaleRequestReminderResolver,
];
