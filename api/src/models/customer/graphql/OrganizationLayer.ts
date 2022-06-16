import { objectType } from '@nexus/schema';
import { OrganizationLayerType } from './OrginazationLayerType';

export const OrganizationLayer = objectType({
  name: 'OrganizationLayer',
  description: `A layer of an organization`,

  definition(t) {
    t.field('type', {
      type: OrganizationLayerType,
    })
  },
});
