import { SystemPermissionEnum } from '@prisma/client';

export interface CustomerAndPermission {
  permissions?: SystemPermissionEnum[];
  id: string;
}

export interface ContextSessionType {
  token: string;
  expiresAt: string;
  globalPermissions: SystemPermissionEnum[];
  customersAndPermissions: CustomerAndPermission[] | undefined;
  userId?: string;
  // We dont know the general role or permissions yet, because that has to be decided on a query-level / resolver-level (since this is about different customers).
}
