import { queryField, objectType } from 'nexus';
import { UserInputError } from 'apollo-server';

import { CampaignVariantModel } from './CampaignVariantModel';
import { DeliveryStatusEnum } from './DeliveryStatusEnum';
import { DeliveryEventModel } from './DeliveryEventModel';

export const DeliveryModel = objectType({
  name: 'DeliveryType',
  description: 'Delivery',
  definition(t) {
    t.id('id');
    t.string('deliveryRecipientFirstName', { nullable: true });
    t.string('deliveryRecipientLastName', { nullable: true });
    t.string('deliveryRecipientEmail', { nullable: true });
    t.string('deliveryRecipientPhone', { nullable: true });
    t.date('createdAt', { nullable: true });
    t.date('scheduledAt', { nullable: true });
    t.date('updatedAt', { nullable: true });

    t.field('campaignVariant', {
      type: CampaignVariantModel,
      nullable: true,
      resolve: (parent, _, ctx) => {
        // @ts-ignore
        if (parent.campaignVariant) return parent.campaignVariant;
        if (!parent.id) return null;

        return ctx.services.campaignService.findCampaignVariantOfDelivery(parent.id);
      },
    });

    t.field('currentStatus', { type: DeliveryStatusEnum });

    t.list.field('events', {
      type: DeliveryEventModel,
      nullable: true,
      resolve: (parent, _, ctx) => {
        // @ts-ignore
        if (parent.events) return parent.events;
        if (!parent.id) return null;

        return ctx.services.campaignService.findDeliveryEventsOfDelivery(parent.id) || [];
      },
    });
  },
});


export const GetDelivery = queryField('delivery', {
  type: DeliveryModel,
  nullable: true,
  args: { deliveryId: 'String' },
  resolve: (parent, args, ctx, info) => {
    if (!args.deliveryId) throw new UserInputError('You forgot the delivery id');
    return ctx.services.campaignService.findDelivery(args.deliveryId);
  },
});
