import { Role, SystemPermissionEnum } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

export interface RoleServiceType {
  fetchDefaultRoleForCustomer(customerId: string): Promise<Role>;
  paginatedRoles(customerId: string, paginationOpts: NexusGenInputs['PaginationWhereInput']): Promise<{
    roles: {
      nrPermissions: number;
      id: string;
      name: string;
      type: "ADMIN" | "MANAGER" | "USER" | "GUEST" | "CUSTOM";
      isPrivate: boolean;
      permissions: any;
      customerId: string | null;
    }[];
    pageInfo: {
      nrPages: number;
      pageIndex: number;
    };
  }>;
  createRole(customerId: string, roleName: string): Promise<Role>;
  updatePermissions(roleId: string, permissions: SystemPermissionEnum[]): Promise<Role>;
  getPermissionsByRoleId(roleId: string): Promise<SystemPermissionEnum[]>;
}