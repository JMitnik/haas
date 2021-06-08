import { BatchPayload, Permission } from "@prisma/client";

export interface PermissionServiceType {
  deletePermissions(permissionIds: string[]): Promise<BatchPayload>;
  createPermission(name: string, customerId: string, description?: string | null | undefined): Promise<Permission>;
}