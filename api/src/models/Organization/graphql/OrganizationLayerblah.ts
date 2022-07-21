import { objectType } from '@nexus/schema';

import { OrganizationLayerType } from './OrganizationLayerTypeblah';

export const OrganizationLayer = objectType({
  name: 'OrganizationLayer',
  description: 'A layer of an organization',

  definition(t) {
    t.id('id');
    t.int('depth');

    t.field('type', {
      type: OrganizationLayerType,
    })
  },
});
