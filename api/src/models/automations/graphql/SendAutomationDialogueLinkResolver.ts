import { GraphQLYogaError } from '@graphql-yoga/node';
import { inputObjectType, mutationField } from 'nexus';

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
    input: SendAutomationDialogueLinkInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object provided for createAutomation Resolver');

    const { workspaceSlug, automationActionId } = args.input;

    return ctx.services.automationActionService.sendDialogueLink(
      workspaceSlug, automationActionId
    );
  },
});

export default [
  SendAutomationDialogueLinkInput,
  SendAutomationDialogueLinkResolver,
];
