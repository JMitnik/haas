import { enumType } from '@nexus/schema';

export const OrganizationLayerType = enumType({
  name: 'OrganizationLayerType',
  description: 'Type of an organizational layer',
  members: ['GROUP', 'DIALOGUE', 'INTERACTION'],
});
