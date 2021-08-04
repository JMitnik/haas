import { mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server';

import prisma from '../../../config/prisma';


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

    const updateDelivery = ctx.prisma.delivery.update({
      where: { id: args.deliveryId },
      data: {
        currentStatus: args.status,
      }
    });

    const createUpdateEvent = ctx.prisma.deliveryEvents.create({
      data: {
        status: args.status,
        Delivery: { connect: { id: args.deliveryId } },
      }
    })

    await prisma.$transaction([updateDelivery, createUpdateEvent]);

    return 'Okay';
  },
});
