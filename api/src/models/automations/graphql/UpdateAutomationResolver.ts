import { inputObjectType, mutationField } from '@nexus/schema';
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

export const EnableAutomationInput = inputObjectType({
  name: 'EnableAutomationInput',
  definition(t) {
    t.string('workspaceId', { required: true });
    t.string('automationId', { required: true });
    t.boolean('state', { required: true });
  },
});

export const EnableAutomationResolver = mutationField('enableAutomation', {
  type: AutomationModel,
  args: {
    input: EnableAutomationInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');

    return ctx.services.automationService.enableAutomation(args.input);
  },
});