import { Permission, PrismaClient, SystemPermissionEnum } from '@prisma/client';

import PermissionPrismaAdapter from './PermissionPrismaAdapter';

export type CreatePermissionInput = {
  name: string
  description?: string | null
  customerId: string
  type: SystemPermissionEnum
}

class PermissionService {
  permissionPrismaAdapter: PermissionPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.permissionPrismaAdapter = new PermissionPrismaAdapter(prismaClient);
  };

  getPermissionsOfCustomer(customerId: string): Promise<Permission[]> {
    return this.permissionPrismaAdapter.findPermissionsByCustomerId(customerId);
  };

  deletePermissions = async (workspaceId: string) => {
    return this.permissionPrismaAdapter.deleteManyByWorkspaceId(workspaceId);
  };

  createPermission = async (input: CreatePermissionInput) => {
    const permission = await this.permissionPrismaAdapter.createPermission(input);
    return permission;
  };

};

export default PermissionService;