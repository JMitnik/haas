import { RoleType, SystemPermission } from "types/generated-types";

/**
 * Default admin role that can generally access all features of the haas dashboard.
 */
export const defaultAdminRole: RoleType = {
  id: 'ROLE_1',
  name: 'Admin',
  __typename: 'RoleType',
  allPermissions: [],
  permissions: [SystemPermission.CanEditUsers, SystemPermission.CanDeleteUsers],
};
