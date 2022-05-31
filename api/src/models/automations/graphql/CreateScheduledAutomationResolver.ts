import { inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

export const CreateScheduledAutomationInput = inputObjectType({
  name: 'CreateScheduledAutomationInput',
  definition(t) {
    t.string('workspaceSlug', { required: true });
  },
});

export const CreateScheduledAutomationResolver = mutationField('createScheduledAutomationResolver', {
  type: 'String',
  args: {
    input: CreateScheduledAutomationInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');
    console.log('Args.input', args.input.workspaceSlug);

    const RuleArn = await ctx.services.automationService.createScheduled(args.input.workspaceSlug) || null;
    return RuleArn;
  },
});

export default [
  CreateScheduledAutomationInput,
  CreateScheduledAutomationResolver,
];