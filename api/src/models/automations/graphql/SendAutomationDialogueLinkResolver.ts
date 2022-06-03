import { inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

export const SendAutomationDialogueLinkInput = inputObjectType({
  name: 'SendAutomationDialogueLinkInput',
  definition(t) {
    t.string('workspaceSlug', { required: true });
    t.string('automationScheduleId', { required: true });
  },
});

export const SendAutomationDialogueLinkResolver = mutationField('sendAutomationDialogueLink', {
  type: 'Boolean',
  args: {
    input: SendAutomationDialogueLinkInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');
    const { automationScheduleId, workspaceSlug } = args.input;

    console.log('Running sendAUtomationDialogueLInk with input: ', args.input);

    return ctx.services.automationActionService.sendDialogueLink(automationScheduleId, workspaceSlug);
  },
});

export default [
  SendAutomationDialogueLinkInput,
  SendAutomationDialogueLinkResolver,
];