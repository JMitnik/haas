import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server';

import { NexusGenFieldTypes } from '../../../generated/nexus';
import { PaginationWhereInput } from '../../general/Pagination';
import { CampaignVariantModel } from './CampaignVariantModel';


export const DeliveryStatusEnum = enumType({
  name: 'DeliveryStatusEnum',

  members: ['SCHEDULED', 'DEPLOYED', 'SENT', 'OPENED', 'FINISHED'],
});

// /**
//  * Data model for a Delivery
//  */
export const DeliveryModel = objectType({
  name: 'DeliveryType',
  description: 'Delivery',
  definition(t) {
    t.id('id');
    t.string('deliveryRecipientFirstName', { nullable: true });
    t.string('deliveryRecipientLastName', { nullable: true });
    t.string('deliveryRecipientEmail', { nullable: true });
    t.string('deliveryRecipientPhone', { nullable: true });
    t.string('scheduledAt', { nullable: true });
    t.string('updatedAt', { nullable: true });
    t.field('campaignVariant', { type: CampaignVariantModel });
    t.field('currentStatus', { type: DeliveryStatusEnum });

    t.list.field('events', { type: DeliveryEventModel });
  },
});

export const DeliveryEventModel = objectType({
  name: 'DeliveryEventType',

  definition(t) {
    t.id('id');
    t.field('status', { type: DeliveryStatusEnum });
    t.string('createdAt');
  }
})

export const DeliveryConnectionModel = objectType({
  name: 'DeliveryConnectionType',

  definition(t) {
    t.implements('ConnectionInterface');
    t.list.field('deliveries', { type: DeliveryModel });
    t.int('nrTotal');
    t.int('nrSent');
    t.int('nrOpened');
    t.int('nrFinished');
  }
});

export const DeliveryConnectionFilterInput = inputObjectType({
  name: 'DeliveryConnectionFilter',

  definition(t) {
    t.string('campaignId');
    t.field('paginationFilter', { type: PaginationWhereInput, nullable: true });
    t.field('status', { type: DeliveryStatusEnum, nullable: true });
    t.id('campaignVariantId', { nullable: true });
  }
})

// /**
//  * Access pattern to access Delivery by itself
//  */
export const GetDelivery = extendType({
  type: 'Query',

  definition(t) {
    t.field('delivery', {
      type: DeliveryModel,
      nullable: true,
      args: { deliveryId: 'String' },
      resolve: async (parent, args, ctx) => {
        if (!args.deliveryId) throw new UserInputError('You forgot the delivery id');

        const delivery = await ctx.prisma.delivery.findFirst({
          where: { id: args.deliveryId || '' },
          include: {
            events: true,
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true,
              }
            }
          }
        });

        return delivery as any;
      }
    });
  }
});

/**
 * Access pattern to access Deliveries by campaign
 */
export const GetDeliveryConnectionOfCampaign = extendType({
  type: 'CampaignType',

  definition(t) {
    t.field('deliveryConnection', {
      type: DeliveryConnectionModel,
      nullable: true,
      args: { filter: DeliveryConnectionFilterInput },

      resolve: async (parent, args, ctx) => {
        const campaignId = parent.id || args?.filter?.campaignId;
        if (!campaignId) throw new UserInputError('No campaign ID was provided');

        const deliveriesPaginated = await ctx.services.campaignService.getPaginatedDeliveries<NexusGenFieldTypes['DeliveryType']>(
          campaignId,
          args?.filter?.paginationFilter || undefined,
          {
            status: args?.filter?.status || undefined,
            variantId: args?.filter?.campaignVariantId || undefined
          }
        );

        const { nrFinished, nrOpened, nrSent, nrTotal } = ctx.services.campaignService.getStatisticsFromDeliveries(deliveriesPaginated.entries);

        return {
          deliveries: deliveriesPaginated.entries,
          pageInfo: deliveriesPaginated.pageInfo,
          offset: args.filter?.paginationFilter?.offset || 0,
          limit: args.filter?.paginationFilter?.limit || 0,
          nrTotal,
          nrFinished,
          nrOpened,
          nrSent
        };
      }
    });
  }
});

/**
 * Access pattern to access Deliveries by campaign variants
 */
export const GetDeliveryOfCampaignVariant = extendType({
  type: 'CampaignVariantType',

  definition(t) {
    t.field('deliveryConnection', { type: DeliveryConnectionModel, nullable: true });
  }
});
