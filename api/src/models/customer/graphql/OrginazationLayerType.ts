import { objectType, enumType } from '@nexus/schema';

export const OrganizationLayerType = enumType({
  name: 'OrganizationLayerType',
  description: `Type of an orginzational layer`,
  members: ['GROUP', 'DIALOGUE', 'INTERACTION'],
});
