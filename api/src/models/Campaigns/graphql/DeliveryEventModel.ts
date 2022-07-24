import { objectType } from 'nexus';

import { DeliveryStatusEnum } from './DeliveryStatusEnum';

export const DeliveryEventModel = objectType({
  name: 'DeliveryEventType',

  definition(t) {
    t.id('id');
    t.field('status', { type: DeliveryStatusEnum });
    t.date('createdAt');
    t.string('failureMessage', { nullable: true });
  },
});
