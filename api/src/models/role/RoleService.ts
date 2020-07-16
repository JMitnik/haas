import { PrismaClient } from '@prisma/client';

import { Nullable } from '../../types/generic';

const prisma = new PrismaClient();

class RoleService {
  static sliceRoles = (
    entries: Array<any>,
    offset: number,
    limit: number,
    pageIndex: number,
  ) => ((offset + limit) < entries.length
    ? entries.slice(offset, (pageIndex + 1) * limit)
    : entries.slice(offset, entries.length));

  static paginatedRoles = async (
    customerId: string,
    pageIndex?: Nullable<number>,
    offset?: Nullable<number>,
    limit?: Nullable<number>,
  ) => {
    let needPageReset = false;

    const roles = await prisma.role.findMany({
      where: { customerId },
      include: {
        permissions: true,
      },
    });

    const totalPages = Math.ceil(roles.length / (limit || 0));
    if (pageIndex && pageIndex + 1 > totalPages) {
      offset = 0;
      needPageReset = true;
    }

    // Slice ordered filtered users
    const slicedOrderedUsers = RoleService.sliceRoles(roles, (offset || 0), (limit || 0), (pageIndex || 0));

    const rolesWithNrPermisisons = slicedOrderedUsers.map((role) => ({
      ...role,
      nrPermissions: role.permissions.length,
    }));

    return {
      roles: rolesWithNrPermisisons,
      newPageIndex: needPageReset ? 0 : pageIndex,
      totalPages,
    };
  };

  static roles = async (customerSlug: string) => {
    const roles = await prisma.role.findMany({
      where: { Customer: {
        slug: customerSlug,
      } },
      include: {
        permissions: true,
      },
    });

    const rolesWithNrPermisisons = roles.map((role) => ({
      ...role,
      nrPermissions: role.permissions.length,
    }));

    return rolesWithNrPermisisons;
  };

  static deleteRoles = async (roleIds: Array<string>) => {
    prisma.role.deleteMany({
      where: {
        id: { in: roleIds },
      },
    });
  };
}

export default RoleService;
