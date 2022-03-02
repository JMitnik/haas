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
  };

  getPermissionsOfCustomer(customerId: string): Promise<Permission[]> {
    return this.permissionPrismaAdapter.findPermissionsByCustomerId(customerId);
  };
};

export default PermissionService;