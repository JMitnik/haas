import { UserInputError } from 'apollo-server';
import { inputObjectType, mutationField } from '@nexus/schema';
import { isPresent } from 'ts-is-present';

import { CampaignCreateInput } from '@prisma/client';
import { CampaignModel, CampaignVariantEnum } from './CampaignModel';
import { NexusGenInputs } from '../../generated/nexus';
import prisma from '../../config/prisma';

export const CreateCampaignVariantInputType = inputObjectType({
  name: 'CreateCampaignVariantInputType',
  definition(t) {
    t.string('label');
    t.id('workspaceId', { required: true });
    t.id('dialogueId', { required: true });
    t.field('type', { type: CampaignVariantEnum, required: true });
    t.string('body');
    t.float('weight');
    t.string('subject', { required: false });
  },
});

export const CreateCampaignInputType = inputObjectType({
  name: 'CreateCampaignInputType',
  definition(t) {
    t.string('label');
    t.list.field('variants', { type: CreateCampaignVariantInputType });
  },
});

const validateProbabilityEdges = (input: NexusGenInputs['CreateCampaignInputType']) => {
  const weights = input.variants?.map((variant) => variant.weight).filter(isPresent) || [];

  const totalWeight = weights?.reduce((total, weight) => total + weight);

  // Since approximation, let's do it like this
  if (totalWeight > 1.01 || totalWeight < 0.99) {
    throw new UserInputError('Weights do not sum up to 1');
  }
};

const saveCampaign = (input: NexusGenInputs['CreateCampaignInputType']): CampaignCreateInput => ({
  label: input.label || '',
  variantsEdges: {
    create: input.variants?.map((variant) => ({
      weight: variant.weight || 0.5,
      campaignVariant: {
        create: {
          label: variant.label || '',
          subject: variant.subject,
          type: variant.type,
          body: variant.body || '',
          dialogue: {
            connect: { id: variant.dialogueId },
          },
          workspace: {
            connect: { id: variant.workspaceId },
          },
        },
      },
    })),
  },
});

export const CreateCampaignResolver = mutationField('createCampaign', {
  type: CampaignModel,
  args: { input: CreateCampaignInputType },

  async resolve(parent, args) {
    if (!args.input) throw new UserInputError('Empty input!');
    validateProbabilityEdges(args?.input);

    const campaign = await prisma.campaign.create({
      data: saveCampaign(args.input),
    });

    return campaign;
  },
});
