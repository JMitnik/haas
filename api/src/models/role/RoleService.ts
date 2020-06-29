import { PrismaClient } from '@prisma/client';

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
    pageIndex: number,
    offset: number,
    limit: number,
  ) => {
    let needPageReset = false;

    const roles = await prisma.role.findMany({
      where: { customerId },
      include: {
        permissions: true,
      },
    });

    const totalPages = Math.ceil(roles.length / limit);
    if (pageIndex + 1 > totalPages) {
      offset = 0;
      needPageReset = true;
    }

    // Slice ordered filtered users
    const slicedOrderedUsers = RoleService.sliceRoles(roles, offset, limit, pageIndex);

    const rolesWithNrPermisisons = slicedOrderedUsers.map((role) => ({
      ...role,
      amtPermissions: role.permissions.length,
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
      amtPermissions: role.permissions.length,
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
