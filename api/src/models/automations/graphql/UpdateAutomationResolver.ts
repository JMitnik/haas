import { mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { CreateAutomationBuilderResolverInput } from '..';
import { AutomationModel } from './AutomationModel';

export const UpdateAutomationResolver = mutationField('updateAutomation', {
  type: AutomationModel,
  args: { input: CreateAutomationBuilderResolverInput },
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');
    console.log('RESOLVER: ', args.input.conditionBuilder)

    const automation = await ctx.services.automationService.updateAutomation(args.input);
    return automation;
  },
});

