import { SystemPermissionEnum, User, UserOfCustomer } from '@prisma/client';

export interface CustomerAndPermission {
  permissions?: SystemPermissionEnum[];
  id: string;
}

export interface UserWithDependencies extends User {
  customers: UserOfCustomer[]
}

export interface ContextSessionType {
  token: string;
  expiresAt: string;
  globalPermissions: SystemPermissionEnum[];
  customersAndPermissions: CustomerAndPermission[] | undefined;
  user: UserWithDependencies | null;
  // We dont know the general role or permissions yet, because that has to be decided on a query-level / resolver-level (since this is about different customers).
}
