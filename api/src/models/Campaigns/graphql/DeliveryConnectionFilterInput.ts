import { enumType, inputObjectType } from '@nexus/schema';

export const DeliveryConnectionOrderByInput = inputObjectType({
  name: 'DeliveryConnectionOrderByInput',
  description: 'Sorting of DeliveryConnection',

  definition(t) {
    t.field('by', { type: DeliveryConnectionOrderType, nullable: false });
    t.boolean('desc', { default: true, required: false });
  },
});

export const DeliveryConnectionOrderType = enumType({
  name: 'DeliveryConnectionOrder',
  description: 'Fields to order DeliveryConnection by.',

  members: ['createdAt']
});

export const DeliveryConnectionFilterInput = inputObjectType({
  name: 'DeliveryConnectionFilterInput',

  definition(t) {
    // Pre-filter
    t.string('search', { required: false });
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });
    t.string('campaignVariantId', { required: false });
    t.string('recipientFirstName', { required: false });
    t.string('recipientLastName', { required: false });
    t.string('recipientPhoneNumber', { required: false });
    t.string('recipientEmail', { required: false });
    t.field('status', { type: 'DeliveryStatusEnum', required: false });

    // Post-order
    t.field('orderBy', { type: DeliveryConnectionOrderByInput });

    // Paginate
    t.int('offset', { nullable: true });
    t.int('perPage', { required: false, default: 10 });
  }
})
