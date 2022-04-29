import { enumType, objectType } from 'nexus';

import { CampaignModel } from './CampaignModel';
import { CustomerType } from '../../customer/graphql/Customer';
import { DeliveryConnectionModel } from './DeliveryConnectionModel';
import { DialogueType } from '../../questionnaire/Dialogue';

export const CampaignVariantEnum = enumType({
  name: 'CampaignVariantEnum',

  members: ['SMS', 'EMAIL', 'QUEUE'],
});

export const CampaignVariantCustomVariableType = objectType({
  name: 'CampaignVariantCustomVariableType',

  definition(t) {
    t.id('id');
    t.string('key');
  },
});

export const CampaignVariantModel = objectType({
  name: 'CampaignVariantType',
  description: 'Variant of campaign',

  definition(t) {
    t.id('id');
    t.string('label');
    t.int('weight');
    t.string('body');
    t.string('from', { nullable: true });
    t.field('type', { type: CampaignVariantEnum });
    t.field('workspace', {
      type: CustomerType,
      nullable: true,
      resolve: (parent, _, ctx) => {
        // @ts-ignore
        if (parent.workspace) return parent.workspace;
        if (!parent.id) return null;

        return ctx.services.campaignService.findWorkspaceOfCampaignVariant(parent.id);
      },
    });
    t.field('dialogue', {
      type: DialogueType,
      nullable: true,
      resolve: (parent, _, ctx) => {
        // @ts-ignore
        if (parent.dialogue) return parent.dialogue;
        if (!parent.id) return null;

        return ctx.services.campaignService.findDialogueOfCampaignVariant(parent.id);
      },
    });
    t.field('campaign', {
      type: CampaignModel,
      nullable: true,
      resolve: (parent, _, ctx) => {
        // @ts-ignore
        if (parent.campaign) return parent.campaign;
        if (!parent.id) return null;

        return ctx.services.campaignService.findCampaignOfVariantId(parent.id);
      },
    });

    t.field('deliveryConnection', { type: DeliveryConnectionModel, nullable: true });

    t.list.field('customVariables', { type: CampaignVariantCustomVariableType, nullable: true });
  },
});
