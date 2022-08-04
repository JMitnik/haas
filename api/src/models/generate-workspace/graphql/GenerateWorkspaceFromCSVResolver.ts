import { enumType, inputObjectType, mutationField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';
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
    t.upload('uploadedCsv', { required: false });
    t.upload('managerCsv', { required: false });
    t.string('type', { required: true, default: 'DEFAULT' });
    t.boolean('generateDemoData', { required: false, default: false });
    t.boolean('isDemo', { required: true, default: false });
  },
});

export const GenerateWorkspaceFromCSVMutation = mutationField('generateWorkspaceFromCSV', {
  type: CustomerType,
  nullable: true,
  args: { input: GenerateWorkspaceCSVInputType },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object provided');

    return ctx.services.generateWorkspaceService.generateWorkspace(args.input, ctx.session?.user?.id);
  },
});
