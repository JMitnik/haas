import { OrganizationLayerType } from './Organization.types';

export const makeLayer = (workspaceId: string, depth: number, type: OrganizationLayerType) => ({
  id: `${workspaceId}-${depth}-${type}`,
  depth,
  type,
});
