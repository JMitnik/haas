import { mutationField } from 'nexus';
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

