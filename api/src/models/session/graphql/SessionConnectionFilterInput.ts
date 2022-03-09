import { enumType, inputObjectType } from '@nexus/schema';

export const SessionConnectionOrderByInput = inputObjectType({
  name: 'SessionConnectionOrderByInput',
  description: 'Sorting of sessionConnection',

  definition(t) {
    t.field('by', { type: SessionConnectionOrderType, nullable: false });
    t.boolean('desc', { default: true, required: false });
  },
});

export const SessionConnectionOrderType = enumType({
  name: 'SessionConnectionOrder',
  description: 'Fields to order SessionConnection by.',

  members: ['createdAt'],
});

export const SessionDeliveryTypeFilter = enumType({
  name: 'SessionDeliveryType',
  description: 'Delivery type of session to filter by.',

  members: ['campaigns', 'noCampaigns'],
});

export const SessionScoreRangeFilter = inputObjectType({
  name: 'SessionScoreRangeFilter',
  description: 'Scores to filter sessions by.',

  definition(t) {
    t.int('min', { required: false });
    t.int('max', { required: false });
  },
});

export const SessionConnectionFilterInput = inputObjectType({
  name: 'SessionConnectionFilterInput',

  definition(t) {
    // Pre-filter
    t.string('search', { required: false });
    t.string('startDate', { required: false });
    t.string('endDate', { required: false });
    t.field('deliveryType', { type: SessionDeliveryTypeFilter, required: false });
    t.field('scoreRange', { type: SessionScoreRangeFilter, required: false });
    t.string('campaignVariantId', { required: false });

    // Post-order
    t.field('orderBy', { type: SessionConnectionOrderByInput });

    // Paginate
    t.int('offset', { nullable: true });
    t.int('perPage', { required: false, default: 10 });
  },
})
