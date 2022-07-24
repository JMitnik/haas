import { Customer, PrismaClient } from '@prisma/client';

import { clearDatabase } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { expectUnauthorizedErrorOnResolver } from '../../../test/utils/expects';
import { seedDialogue, seedUser, seedWorkspace } from '../../../test/utils/seedTestData';
import AuthService from '../../auth/AuthService';
import { range } from 'lodash';
import { ApolloError } from 'apollo-server-express';
import { prisma } from '../../../test/setup/singletonDeps';


jest.setTimeout(30000);

const ctx = makeTestContext(prisma);


/**
 * Prepare the database by seeding, etc.
 * @param prisma
 * @returns
 */
const prepEnvironment = async (prisma: PrismaClient) => {
  const workspace = await seedWorkspace(prisma);
  await seedDialogue(prisma, workspace.id);

  return { workspace };
}

const Query = `
query getPaginatedUsers($customerSlug: String!, $filter: UserConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    usersConnection(filter: $filter) {
      userCustomers {
        createdAt
        isActive
        user {
          lastLoggedIn
          lastActivity
          id
          email
          firstName
          lastName
        }
        role {
          id
          name
        }
      }
      totalPages
      pageInfo {
        hasPrevPage
        hasNextPage
        prevPageOffset
        nextPageOffset
        pageIndex
      }
    }
  }
}
`;

/**
 * Seed users, and return one Access user.
 * @param prisma
 * @param workspace
 * @returns
 */
const seedUsers = async (prisma: PrismaClient, workspace: Customer) => {
  // Make 22 users: 2 Reader, 10 Admins, 10 Managers
  const { user } = await seedUser(prisma, workspace.id, {
    name: 'Reader',
    permissions: { set: ['CAN_VIEW_USERS'] },
  }, { firstName: 'John', lastName: 'Aaaa', email: 'JohnAaaa@gmail.com' });

  await seedUser(prisma, workspace.id, {
    name: 'Reader',
    permissions: { set: ['CAN_VIEW_USERS'] },
  }, { firstName: 'Zion', lastName: 'Zzzz', email: 'Zionzzzz@gmail.com' });

  await Promise.all(range(10).map(async () => (
    seedUser(prisma, workspace.id, {
      name: 'Manager',
      permissions: { set: ['CAN_VIEW_DIALOGUE'] },
    })
  )));

  await Promise.all(range(10).map(async () => (
    seedUser(prisma, workspace.id, {
      name: 'Admin',
      permissions: { set: ['CAN_VIEW_DIALOGUE', 'CAN_VIEW_USERS'] },
    })
  )));

  return user;
}


describe('UserConnection resolvers', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('user with no valid has no access to users-connection', async () => {
    const { workspace } = await prepEnvironment(prisma);
    const user = await seedUsers(prisma, workspace);
    const token = AuthService.createUserToken(user.id, 22);

    try {
      await ctx.client.request(Query, {
        customerSlug: workspace.slug,
      }, { 'Authorization': `Bearer ${token}` });
    } catch (error) {
      if (error instanceof ApolloError) {
        expect(error.response.errors).toHaveLength(1);
        expectUnauthorizedErrorOnResolver(error.response.errors[0], 'usersConnection');
      }
    }
  });

  test('user can access users-connection', async () => {
    const { workspace } = await prepEnvironment(prisma);
    const user = await seedUsers(prisma, workspace);
    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBe(5);
    expect(res.customer.usersConnection.pageInfo.hasPrevPage).toBe(false);
    expect(res.customer.usersConnection.pageInfo.hasNextPage).toBe(true);
    expect(res.customer.usersConnection.pageInfo.nextPageOffset).toBe(5);

    // Go to next page
    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 5, perPage: 5 },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBe(5);
    expect(res.customer.usersConnection.pageInfo.hasPrevPage).toBe(true);
    expect(res.customer.usersConnection.pageInfo.hasNextPage).toBe(true);
    expect(res.customer.usersConnection.pageInfo.nextPageOffset).toBe(10);
    expect(res.customer.usersConnection.pageInfo.pageIndex).toBe(1);
  });

  test('user can filter users-connection by generic search', async () => {
    const { workspace } = await prepEnvironment(prisma);
    const user = await seedUsers(prisma, workspace);
    const token = AuthService.createUserToken(user.id, 22);

    // Search by generic: lastname
    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { search: 'Zzzz' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBe(1);
    expect(res.customer.usersConnection.userCustomers).toHaveLength(1);

    // Search by generic: first name
    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { search: 'John' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBeGreaterThanOrEqual(1);
    expect(res.customer.usersConnection.userCustomers.length).toBeGreaterThanOrEqual(1);

    // Search by generic: email
    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { search: 'JohnAaaa@gmail.com' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBeGreaterThanOrEqual(1);
    expect(res.customer.usersConnection.userCustomers.length).toBeGreaterThanOrEqual(1);
  });

  test('user can filter users-connection by firstname search', async () => {
    const { workspace } = await prepEnvironment(prisma);
    const user = await seedUsers(prisma, workspace);
    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { firstName: 'Zion' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBe(1);
    expect(res.customer.usersConnection.userCustomers).toHaveLength(1);

    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { firstName: 'John' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBeGreaterThanOrEqual(1);
    expect(res.customer.usersConnection.userCustomers.length).toBeGreaterThanOrEqual(1);
  });

  test('user can filter users-connection by role search', async () => {
    const { workspace } = await prepEnvironment(prisma);
    const user = await seedUsers(prisma, workspace);
    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { role: 'Reader' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.usersConnection.totalPages).toBe(1);
    expect(res.customer.usersConnection.userCustomers).toHaveLength(2);
  });
});
