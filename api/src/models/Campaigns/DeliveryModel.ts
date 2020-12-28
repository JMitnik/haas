import { enumType, objectType } from '@nexus/schema';

export const DeliveryModel = objectType({
  name: 'Delivery',
  description: 'Delivery',
  definition(t) {
    t.id('id');
  },
});

export const DeliveryStatusEnum = enumType({
  name: 'DeliveryStatusEnum',

  members: ['SCHEDULED', 'DEPLOYED', 'SENT', 'OPENED', 'FINISHED'],
});
