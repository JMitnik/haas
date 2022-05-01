import { enumType, inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { CustomerType } from '../../customer/graphql/Customer'

export const DialogueTemplateType = enumType({
  name: 'DialogueTemplateType',
  members: ['SPORT_ENG', 'SPORT_NL', 'BUSINESS_ENG', 'BUSINESS_NL', 'DEFAULT', 'MASS_SEED'],
})

export const GenerateWorkspaceCSVInputType = inputObjectType({
  name: 'GenerateWorkspaceCSVInputType',
  definition(t) {
    t.string('workspaceSlug', { required: true });
    t.string('workspaceTitle', { required: true });
    t.upload('uploadedCsv', { required: true });
    t.field('type', { type: DialogueTemplateType, default: 'DEFAULT' });
  },
});

export const GenerateWorkspaceFromCSVMutation = mutationField('generateWorkspaceFromCSV', {
  type: CustomerType,
  args: { input: GenerateWorkspaceCSVInputType },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input object provided');
    return ctx.services.generateWorkspaceService.generateWorkspaceFromCSV(args.input);
  },
});