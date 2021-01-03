import { mutationField } from "@nexus/schema";
import { UserInputError } from "apollo-server";


/**
 * Resolver for updating current delivery. Will not update once 'Finished'.
 */
export const UpdateDeliveryStatusResolver = mutationField('updateDeliveryStatus', {
    type: 'String',
    args: { deliveryId: 'String', status: 'DeliveryStatusEnum' },
  
    async resolve(parent, args, ctx) {
      if (!args.deliveryId) throw new UserInputError('No delivery ID provided');
      if (!args.status) throw new UserInputError('No status provided');

      const currentDelivery = await ctx.prisma.delivery.findOne({ where: { id: args.deliveryId } });

      if (currentDelivery?.currentStatus === 'FINISHED') return 'Already finished';

      await ctx.prisma.delivery.update({
        where: { id: args.deliveryId },
        data: {
          currentStatus: args.status,
        }
      });
  
      return 'Okay';
    },
  });
  