import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import RolePrismaAdapter from "../RolePrismaAdapter";
import { clearDatabase } from "./testUtils";

const prisma = makeTestPrisma();
const rolePrismaAdapter = new RolePrismaAdapter(prisma);

describe('RolePrismaAdapter', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('Finds role by ID', async () => {
    await prisma.role.create({
      data: {
        name: 'roleOne',
        id: 'roleOneId',
      },
    });

    await prisma.role.create({
      data: {
        name: 'roleTwo',
        id: 'roleTwoId',
      }
    });

    const notFound = await rolePrismaAdapter.getRoleById('');
    expect(notFound).toBeNull();

    const found = await rolePrismaAdapter.getRoleById('roleTwoId');
    expect(found).not.toBeNull();
    expect(found?.name).toBe('roleTwo');
  });

  test('Updates permissions of a role', async () => {
    const role = await prisma.role.create({
      data: {
        name: 'roleOne',
        id: 'roleOneId',
        permissions: ['CAN_ACCESS_ADMIN_PANEL'],
      },
    });

    const updatedRole = await rolePrismaAdapter.updatePermissions(role.id, ['CAN_ADD_USERS', 'CAN_BUILD_DIALOGUE']);
    expect(updatedRole?.permissions).toHaveLength(2);
    const canAddUsers = updatedRole?.permissions.find((permission) => permission === 'CAN_ADD_USERS');
    expect(canAddUsers).not.toBeUndefined();
    const canBuildDialogue = updatedRole?.permissions.find((permission) => permission === 'CAN_BUILD_DIALOGUE');
    expect(canBuildDialogue).not.toBeUndefined();
  });

  test('Deletes many roles by their IDs', async () => {
    await prisma.role.create({
      data: {
        name: 'roleOne',
        id: 'roleOneId',
      },
    });

    await prisma.role.create({
      data: {
        name: 'roleTwo',
        id: 'roleTwoId',
      }
    });

    await prisma.role.create({
      data: {
        name: 'roleThree',
        id: 'roleThreeId',
      }
    });

    await rolePrismaAdapter.deleteMany(['roleOneId', 'roleThreeId']);

    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: ['roleOneId', 'roleTwoId', 'roleThreeId'],
        },
      },
    });

    expect(roles).toHaveLength(1);
    expect(roles?.[0]?.id).toBe('roleTwoId')
  });

  test('Deletes roles by customer slug', async () => {
    await prisma.customer.create({
      data: {
        name: 'customerOne',
        slug: 'customerSlugOne',
        roles: {
          createMany: {
            data: [
              {
                name: 'roleOne',
                id: 'roleOneId',
              },
              {
                name: 'roleTwo',
                id: 'roleTwoId',
              },
            ],
          },
        },
      },
    });

    await prisma.customer.create({
      data: {
        name: 'customerTwo',
        slug: 'customerSlugTwo',
        roles: {
          createMany: {
            data: [
              {
                name: 'roleThree',
                id: 'roleThreeId',
              },
              {
                name: 'roleFour',
                id: 'roleFourId',
              },
            ],
          },
        },
      },
    });

    const notFound = await rolePrismaAdapter.findManyByCustomerSlug('');
    expect(notFound).toHaveLength(0);

    const foundRoles = await rolePrismaAdapter.findManyByCustomerSlug('customerSlugTwo');
    expect(foundRoles).toHaveLength(2);
    const roleThree = foundRoles.find((role) => role.id === 'roleThreeId');
    expect(roleThree).not.toBeUndefined();
    const roleFour = foundRoles.find((role) => role.id === 'roleFourId');
    expect(roleFour).not.toBeUndefined();
  });

  test('Counts amount of roles based on where input', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'customerOne',
        slug: 'customerSlugOne',
        roles: {
          createMany: {
            data: [
              {
                name: 'roleOne',
                id: 'roleOneId',
              },
              {
                name: 'roleTwo',
                id: 'roleTwoId',
              },
            ],
          },
        },
      },
    });

    await prisma.customer.create({
      data: {
        name: 'customerTwo',
        slug: 'customerSlugTwo',
        roles: {
          createMany: {
            data: [
              {
                name: 'roleThree',
                id: 'roleThreeId',
              },
              {
                name: 'roleFour',
                id: 'roleFourId',
              },
            ],
          },
        },
      },
    });

    const amountRoles = await rolePrismaAdapter.count({
      customerId: customer.id,
    });

    expect(amountRoles).toBe(2);
  });

  test('Finds paginated roles', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'customerOne',
        slug: 'customerSlugOne',
        roles: {
          createMany: {
            data: [
              {
                name: 'roleOne',
                id: 'roleOneId',
              },
              {
                name: 'roleTwo',
                id: 'roleTwoId',
              },
              {
                name: 'roleFive',
                id: 'roleFiveId',
              }
            ],
          },
        },
      },
    });

    await prisma.customer.create({
      data: {
        name: 'customerTwo',
        slug: 'customerSlugTwo',
        roles: {
          createMany: {
            data: [
              {
                name: 'roleThree',
                id: 'roleThreeId',
              },
              {
                name: 'roleFour',
                id: 'roleFourId',
              },
            ],
          },
        },
      },
    });
    const foundRoles = await rolePrismaAdapter.findRolesPaginated({ customerId: customer.id });
    expect(foundRoles).toHaveLength(3);
    const roleOne = foundRoles.find((role) => role.id === 'roleOneId');
    expect(roleOne).not.toBeUndefined();
    const roleTwo = foundRoles.find((role) => role.id === 'roleTwoId');
    expect(roleTwo).not.toBeUndefined();
    const roleFive = foundRoles.find((role) => role.id === 'roleFiveId');
    expect(roleFive).not.toBeUndefined();

    const foundOneRole = await rolePrismaAdapter.findRolesPaginated({ customerId: customer.id }, 1);
    expect(foundOneRole).toHaveLength(1);
  });
});
