import { mutationField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';

import { CreateAutomationInput } from '..';
import { AutomationModel } from './AutomationModel';

export const UpdateAutomationResolver = mutationField('updateAutomation', {
  type: AutomationModel,
  args: { input: CreateAutomationInput },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object provided for createAutomation Resolver');

    const automation = await ctx.services.automationService.updateAutomation(args.input);
    return automation as any;
  },
});
