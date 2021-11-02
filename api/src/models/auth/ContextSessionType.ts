import { SystemPermissionEnum, User, UserOfCustomer, PermissionOfWorkspaceRole, Permission } from '@prisma/client';

export interface CustomerAndPermission {
  permissions?: Permission[];
  id: string;
}

export interface UserWithDependencies extends User {
  customers: UserOfCustomer[]
  globalPermissions: { type: SystemPermissionEnum; }[];
}

export interface ActiveWorkspaceType {
  id: string;
  permissions: Permission[];
}

export interface ContextSessionType {
  token: string;
  expiresAt: string;
  baseUrl: string;
  globalPermissions: { type: SystemPermissionEnum; }[];
  customersAndPermissions: CustomerAndPermission[] | undefined;
  user: UserWithDependencies | null;
  activeWorkspace: ActiveWorkspaceType | null;
}
