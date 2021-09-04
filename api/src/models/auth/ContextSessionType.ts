import { SystemPermissionEnum, User, UserOfCustomer } from '@prisma/client';

export interface CustomerAndPermission {
  permissions?: SystemPermissionEnum[];
  id: string;
}

export interface UserWithDependencies extends User {
  customers: UserOfCustomer[]
}

export interface ActiveWorkspaceType {
  id: string;
  permissions: SystemPermissionEnum[];
}

export interface ContextSessionType {
  token: string;
  expiresAt: string;
  baseUrl: string;
  globalPermissions: SystemPermissionEnum[];
  customersAndPermissions: CustomerAndPermission[] | undefined;
  user: UserWithDependencies | null;
  activeWorkspace: ActiveWorkspaceType | null;
}
