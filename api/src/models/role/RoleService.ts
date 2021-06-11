import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import prisma from '../../config/prisma';
import { RoleServiceType } from './RoleServiceType';
import { PrismaClient } from '@prisma/client';
import { RolePrismaAdapterType } from './RolePrismaAdapterType';
import RolePrismaAdapter from './adapters/Role/RolePrismaAdapter';

class RoleService implements RoleServiceType {
  rolePrismaAdapter: RolePrismaAdapterType;

  constructor(prismaClient: PrismaClient) {
    this.rolePrismaAdapter = new RolePrismaAdapter(prismaClient);
  }

  async getPermissionsByRoleId(roleId: string): Promise<("CAN_ACCESS_ADMIN_PANEL" | "CAN_EDIT_DIALOGUE" | "CAN_BUILD_DIALOGUE" | "CAN_VIEW_DIALOGUE" | "CAN_DELETE_DIALOGUE" | "CAN_VIEW_DIALOGUE_ANALYTICS" | "CAN_VIEW_USERS" | "CAN_ADD_USERS" | "CAN_DELETE_USERS" | "CAN_EDIT_USERS" | "CAN_CREATE_TRIGGERS" | "CAN_DELETE_TRIGGERS" | "CAN_DELETE_WORKSPACE" | "CAN_EDIT_WORKSPACE" | "CAN_VIEW_CAMPAIGNS" | "CAN_CREATE_CAMPAIGNS" | "CAN_CREATE_DELIVERIES")[]> {
    const role = await this.rolePrismaAdapter.getRoleById(roleId);
    return role?.permissions || [];
  }

  updatePermissions(roleId: string, permissions: ("CAN_ACCESS_ADMIN_PANEL" | "CAN_EDIT_DIALOGUE" | "CAN_BUILD_DIALOGUE" | "CAN_VIEW_DIALOGUE" | "CAN_DELETE_DIALOGUE" | "CAN_VIEW_DIALOGUE_ANALYTICS" | "CAN_VIEW_USERS" | "CAN_ADD_USERS" | "CAN_DELETE_USERS" | "CAN_EDIT_USERS" | "CAN_CREATE_TRIGGERS" | "CAN_DELETE_TRIGGERS" | "CAN_DELETE_WORKSPACE" | "CAN_EDIT_WORKSPACE" | "CAN_VIEW_CAMPAIGNS" | "CAN_CREATE_CAMPAIGNS" | "CAN_CREATE_DELIVERIES")[]) {
    return this.rolePrismaAdapter.update(roleId, {
      permissions: {
        // TODO: Set to appropriate logic
        set: permissions
      },
    })
  }

  createRole(customerId: string, roleName: string): Promise<import("@prisma/client").Role> {
    return this.rolePrismaAdapter.create({
      name: roleName,
      permissions: {
        set: [
          'CAN_VIEW_DIALOGUE',
        ],
      },
      Customer: {
        connect: {
          id: customerId,
        },
      },
    })
  }

  paginatedRoles = async (
    customerId: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const roles = await this.rolePrismaAdapter.findManyPaginated({ customerId }, paginationOpts.limit || undefined, paginationOpts.offset || undefined);

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

  async fetchDefaultRoleForCustomer(customerId: string) {
    const roles = await this.rolePrismaAdapter.findManyPaginated({ customerId: customerId })

    const guestRole = roles.find((role) => role.name.toLowerCase().includes('guest'));
    if (guestRole) return guestRole;

    // TODO: Make this a better heuristic

    const firstRole = roles?.[0];
    if (firstRole) return firstRole;

    throw new Error('Unable to find any roles');
  }

  deleteRoles = async (roleIds: Array<string>) => {
    return this.rolePrismaAdapter.deleteMany(roleIds);
  };
}

export default RoleService;
