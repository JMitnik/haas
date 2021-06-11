import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { PermissionPrismaAdapterType } from './PermissionPrismaAdapterType';
import PermissionPrismaAdapter from './PermissionPrismaAdapter';
import { PermissionServiceType } from './PermissionServiceType';

class PermissionService implements PermissionServiceType {
  permissionPrismaAdapter: PermissionPrismaAdapterType;

  constructor(prismaClient: PrismaClient) {
    this.permissionPrismaAdapter = new PermissionPrismaAdapter(prismaClient);
  }

  getPermissionsOfCustomer(customerId: string): Promise<import("@prisma/client").Permission[]> {
    return this.permissionPrismaAdapter.findManyByCustomerId(customerId);
  }

  deletePermissions = async (permissionIds: Array<string>) => {
   return this.permissionPrismaAdapter.deleteMany(permissionIds);
  };

  createPermission = async (name: string, customerId: string, description?: string | null | undefined) => {
    const permission = await this.permissionPrismaAdapter.create({
      name,
      description,
      Customer: {
        connect: { id: customerId },
      },
    });

    return permission;
  };
}
export default PermissionService;
