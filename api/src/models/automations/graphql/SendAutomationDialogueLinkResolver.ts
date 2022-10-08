import { inputObjectType, mutationField, nonNull } from 'nexus';

export const SendAutomationDialogueLinkInput = inputObjectType({
  name: 'SendAutomationDialogueLinkInput',
  definition(t) {
    t.string('workspaceSlug', { required: true });
    t.string('automationActionId', { required: true });
  },
});

export const SendAutomationDialogueLinkResolver = mutationField('sendAutomationDialogueLink', {
  type: 'Boolean',
  args: {
    input: nonNull(SendAutomationDialogueLinkInput),
  },
  nullable: true,
  resolve: async (parent, args, ctx) => {
    console.log('In SendAutomationDialogueLinkResolver');
    return ctx.services.automationActionService.sendDialogueLink(
      args.input.workspaceSlug, args.input.automationActionId
    );
  },
});

export default [
  SendAutomationDialogueLinkInput,
  SendAutomationDialogueLinkResolver,
];
