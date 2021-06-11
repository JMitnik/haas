import { RoleWhereInput, Role, BatchPayload, RoleCreateInput, RoleUpdateInput, SystemPermissionEnum } from "@prisma/client";

export interface RolePrismaAdapterType {
  findManyPaginated(where: RoleWhereInput, take?: number, skip?: number): Promise<Role[]>;
  findManyByCustomerSlug(customerSlug: string): Promise<Role[]>;
  count(where: RoleWhereInput): Promise<number>;
  deleteMany(roleIds: string[]): Promise<BatchPayload>;
  create(data: RoleCreateInput): Promise<Role>;
  update(roleId: string, data: RoleUpdateInput): Promise<Role>;
  getRoleById(roleId: string): Promise<Role | null>;
}