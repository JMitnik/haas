import { enumType } from 'nexus';

export const DeliveryStatusEnum = enumType({
  name: 'DeliveryStatusEnum',

  members: ['SCHEDULED', 'DEPLOYED', 'SENT', 'OPENED', 'FINISHED', 'FAILED', 'DELIVERED'],
});
