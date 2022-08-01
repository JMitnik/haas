import { GraphQLYogaError } from '@graphql-yoga/node';
import { inputObjectType, mutationField } from 'nexus';

import { CampaignModel } from './CampaignModel';
import { CampaignVariantEnum } from './CampaignVariantModel';

export const CreateCampaignCustomVariable = inputObjectType({
  name: 'CreateCampaignCustomVariable',

  definition(t) {
    t.string('key');
  },
});

export const CreateCampaignVariantInputType = inputObjectType({
  name: 'CreateCampaignVariantInputType',
  definition(t) {
    t.id('workspaceId', { required: true });
    t.id('dialogueId', { required: true });

    t.string('label');
    t.string('body');
    t.string('from', { required: false });
    t.string('subject', { required: false });
    t.float('weight');

    t.field('type', { type: CampaignVariantEnum, required: true });
    t.list.field('customVariables', { type: CreateCampaignCustomVariable, required: false });
  },
});


export const CreateCampaignInputType = inputObjectType({
  name: 'CreateCampaignInputType',
  definition(t) {
    t.string('label');
    t.id('workspaceId', { required: true });
    t.list.field('variants', { type: CreateCampaignVariantInputType });
  },
});

export const CreateCampaignResolver = mutationField('createCampaign', {
  type: CampaignModel,
  args: { input: CreateCampaignInputType },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('Empty input!');
    const campaign = await ctx.services.campaignService.createCampaign(args.input);

    return {
      ...campaign,
      deliveries: [],
      variants: campaign.variantsEdges.map(variantEdge => ({
        weight: variantEdge.weight,
        ...variantEdge.campaignVariant,
      })),
    };
  },
});
