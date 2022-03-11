import { inputObjectType, mutationField } from '@nexus/schema';
import { AutomationAction } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';
import { CreateAutomationInput } from '..';
import { AutomationModel } from './AutomationModel';

export const UpdateAutomationResolver = mutationField('updateAutomation', {
  type: AutomationModel,
  args: { input: CreateAutomationInput },
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');

    const automation = await ctx.services.automationService.updateAutomation(args.input);
    return automation;
  },
});

export const HandleAutomationActionsInput = inputObjectType({
  name: 'HandleAutomationActionsInput',
  definition(t) {
    t.string('workspaceSlug', { required: true });
    t.string('automationId', { required: true });
  },
});

// TODO: Remove before deployment i'd say
export const HandleAutomationActions = mutationField('handleAutomationActions', {
  type: 'Boolean',
  args: {
    input: HandleAutomationActionsInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');
    const automation = await ctx.prisma.automation.findUnique({
      where: {
        id: args.input.automationId,
      },
      include: {
        automationTrigger: {
          include: {
            actions: true,
          },
        },
      },
    })

    const res = await ctx.services.automationService.handleAutomationAction(
      automation?.automationTrigger?.actions[0] as AutomationAction,
      args.input.workspaceSlug);

    return true;
  },
})