import { enumType, extendType, objectType } from '@nexus/schema';

export const DeliveryModel = objectType({
  name: 'DeliveryType',
  description: 'Delivery',
  definition(t) {
    t.id('id');
    t.string('recipientFirstName');
    t.string('recipientLastName');
  },
});

export const DeliveryConnectionModel = objectType({
  name: 'DeliveryConnectionType',
  
  definition(t) {
    t.implements('ConnectionInterface');
    t.list.field('deliveries', { type: DeliveryModel });
  }
});

/**
 * Access pattern to access Delivery by itself
 */
export const GetDelivery = extendType({
  type: 'Query',

  definition(t) {
    t.field('delivery', { 
      type: DeliveryModel,
      args: { deliveryId: 'String' },
      resolve: async (parent, args, ctx) => {
        const delivery = await ctx.prisma.delivery.findFirst({
          where: { id: args.deliveryId || '' },
          include: {
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
    t.field('deliveryCollection', { 
      type: DeliveryConnectionModel, 
      nullable: true,
      resolve: async (parent, args, ctx) => {
        
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

export const DeliveryStatusEnum = enumType({
  name: 'DeliveryStatusEnum',

  members: ['SCHEDULED', 'DEPLOYED', 'SENT', 'OPENED', 'FINISHED'],
});
