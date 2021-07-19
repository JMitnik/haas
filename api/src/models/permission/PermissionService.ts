import { Permission, PrismaClient } from '@prisma/client';
import PermissionPrismaAdapter from './PermissionPrismaAdapter';

export type CreatePermissionInput = {
  id?: string
  name: string
  description?: string | null
  customerId?: string
}

class PermissionService {
  permissionPrismaAdapter: PermissionPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.permissionPrismaAdapter = new PermissionPrismaAdapter(prismaClient);
  }

  getPermissionsOfCustomer(customerId: string): Promise<Permission[]> {
    return this.permissionPrismaAdapter.findManyByCustomerId(customerId);
  }

  deletePermissions = async (permissionIds: Array<string>) => {
    return this.permissionPrismaAdapter.deleteMany(permissionIds);
  };

  createPermission = async (name: string, customerId: string, description?: string | null | undefined) => {
    const input: CreatePermissionInput = { name, description, customerId };
    const permission = await this.permissionPrismaAdapter.createPermission(input);
    return permission;
  };
}
export default PermissionService;
