import { inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { CustomerType } from '../../customer/graphql/Customer'

export const GenerateWorkspaceCSVInputType = inputObjectType({
  name: 'GenerateWorkspaceCSVInputType',
  definition(t) {
    t.string('workspaceSlug', { required: true });
    t.string('workspaceTitle', { required: true });
    t.upload('uploadedCsv', { required: true });
  },
});

export const GenerateGroupsMutation = mutationField('generateWorkspaceFromCSV', {
  type: CustomerType,
  // nullable: true,
  args: { input: GenerateWorkspaceCSVInputType },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input object provided');

    return ctx.services.generateWorkspaceService.generateWorkspaceFromCSV(args.input);
  },
});