import { BatchPayload, PermissionCreateInput, Permission, Customer } from "@prisma/client";

export interface PermissionPrismaAdapterType {
  deleteMany(permissionIds: string[]): Promise<BatchPayload>;
  create(data: PermissionCreateInput): Promise<Permission & { Customer: Customer | null; }>;
  findManyByCustomerId(customerId: string): Promise<Permission[]>;
}