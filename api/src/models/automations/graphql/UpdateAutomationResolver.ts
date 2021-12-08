import { mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { CreateAutomationResolverInput } from '..';
import { AutomationModel } from './AutomationModel';

export const UpdateAutomationResolver = mutationField('updateAutomation', {
  type: AutomationModel,
  args: { input: CreateAutomationResolverInput },
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');

    const automation = await ctx.services.automationService.updateAutomation(args.input);
    return automation;
  },
});

