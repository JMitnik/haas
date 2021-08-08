import { PrismaClient, Role, SystemPermissionEnum } from '@prisma/client';

import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import RolePrismaAdapter from './RolePrismaAdapter';

export interface CreateRoleInput {
  permissions: SystemPermissionEnum[];
  name: string;
  customerId: string;
}

class RoleService {
  rolePrismaAdapter: RolePrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.rolePrismaAdapter = new RolePrismaAdapter(prismaClient);
  };

  async getPermissionsByRoleId(roleId: string): Promise<SystemPermissionEnum[]> {
    const role = await this.rolePrismaAdapter.getRoleById(roleId);
    return role?.permissions || [];
  };

  updatePermissions(roleId: string, permissions: SystemPermissionEnum[]) {
    return this.rolePrismaAdapter.updatePermissions(roleId, permissions);
  };

  createRole(customerId: string, roleName: string): Promise<Role> {
    const createInput: CreateRoleInput = {
      name: roleName,
      permissions: ['CAN_VIEW_DIALOGUE'],
      customerId,
    };

    return this.rolePrismaAdapter.createRole(createInput);
  };

  paginatedRoles = async (
    customerId: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const roles = await this.rolePrismaAdapter.findRolesPaginated({ customerId }, paginationOpts.limit || undefined, paginationOpts.offset || undefined);

    const totalRoles = await this.rolePrismaAdapter.count({ customerId });
    const totalPages = paginationOpts.limit ? Math.ceil(totalRoles / (paginationOpts.limit)) : 1;

    const currentPage = paginationOpts.pageIndex && paginationOpts.pageIndex <= totalPages
      ? paginationOpts.pageIndex : 1;

    const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
      nrPages: totalPages,
      pageIndex: currentPage,
    };

    return {
      roles: roles.map((role) => ({ ...role, nrPermissions: role.permissions.length })),
      pageInfo,
    };
  };

  getAllRolesForWorkspaceBySlug = async (workspaceSlug: string) => {
    const roles = await this.rolePrismaAdapter.findManyByCustomerSlug(workspaceSlug);

    return roles;
  }

  async fetchDefaultRoleForCustomer(customerId: string) {
    const roles = await this.rolePrismaAdapter.findRolesPaginated({ customerId: customerId })

    const guestRole = roles.find((role) => role.name.toLowerCase().includes('guest'));
    if (guestRole) return guestRole;

    // TODO: Make this a better heuristic

    const firstRole = roles?.[0];
    if (firstRole) return firstRole;

    throw new Error('Unable to find any roles');
  };

  deleteRoles = async (roleIds: Array<string>) => {
    return this.rolePrismaAdapter.deleteMany(roleIds);
  };

};

export default RoleService;
