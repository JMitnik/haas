import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import prisma from '../../prisma';

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
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const roles = await prisma.role.findMany({
      where: { customerId },
      take: paginationOpts.limit || undefined,
      skip: paginationOpts.offset || undefined,
      include: {
        permissions: true,
      },
    });

    const totalRoles = await prisma.role.count({ where: { customerId } });
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

  static async fetchDefaultRoleForCustomer(customerId: string) {
    const customerWithRoles = await prisma.customer.findOne({
      where: { id: customerId },
      include: {
        roles: true,
      },
    });

    const guestRole = customerWithRoles?.roles.find((role) => role.name.toLowerCase().includes('guest'));
    if (guestRole) return guestRole;

    // TODO: Make this a better heuristic

    const firstRole = customerWithRoles?.roles?.[0];
    if (firstRole) return firstRole;

    throw new Error('Unable to find any roles');
  }

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
