import { enumType } from '@nexus/schema';

export const DeliveryStatusEnum = enumType({
  name: 'DeliveryStatusEnum',

  members: ['SCHEDULED', 'DEPLOYED', 'SENT', 'OPENED', 'FINISHED', 'FAILED', 'DELIVERED'],
});
