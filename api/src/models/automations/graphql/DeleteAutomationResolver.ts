import { inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { AutomationModel } from './AutomationModel';

export const DeleteAutomationInput = inputObjectType({
  name: 'DeleteAutomationInput',
  definition(t) {
    t.string('workspaceId', { required: true });
    t.string('automationId', { required: true });
  },
});

export const DeleteAutomationResolver = mutationField('deleteAutomation', {
  type: AutomationModel,
  args: {
    input: DeleteAutomationInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');

    return ctx.services.automationService.deleteAutomation(args.input);
  },
});