import { Customer, Dialogue, PrismaClient } from 'prisma/prisma-client';
import { range } from 'lodash';

import { clearDatabase, prepDefaultCreateData, seedAutomation } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { prisma } from '../../../test/setup/singletonDeps';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Query = `
  query getPaginatedAutomations($customerSlug: String!, $filter: AutomationConnectionFilterInput) {
    customer(slug: $customerSlug) {
      id
      automationConnection(filter: $filter) {
        automations {
          label
          type
          updatedAt
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

const seedAutomations = async (prisma: PrismaClient, workspace: Customer, dialogue: Dialogue, amount?: number) => {
  await Promise.all(range(amount || 22).map(async (i) => {
    const question = await prisma.questionNode.create({
      data: {
        title: `Question ${i}`,
        questionDialogue: {
          connect: {
            id: dialogue.id,
          },
        },
      },
    })
    await seedAutomation(prisma, workspace.id, dialogue.id, question.id, i, `AUTOMATION_DESCRIPTION_LOOKUP#${i}`);
  }));
}


describe('AutomationConnection resolvers', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
  });

  test('unable to query automation-connection unauthorized', async () => {
    const { user, workspace, dialogue, userRole } = await prepDefaultCreateData(prisma);

    await seedAutomations(prisma, workspace, dialogue, 1);

    await prisma.role.update({
      where: { id: userRole.id },
      data: {
        permissions: [],
      },
    });

    const token = AuthService.createUserToken(user.id, 22);
    try {
      await ctx.client.request(Query, {
        customerSlug: workspace.slug,
      }, { 'Authorization': `Bearer ${token}` });
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toContain('Not Authorised!');
      } else { throw new Error(); }
    }
  });

  test('user can access automation-connection', async () => {
    const { user, workspace, dialogue } = await prepDefaultCreateData(prisma);
    await seedAutomations(prisma, workspace, dialogue);

    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.automationConnection.totalPages).toBe(5);
    expect(res.customer.automationConnection.pageInfo.hasPrevPage).toBe(false);
    expect(res.customer.automationConnection.pageInfo.hasNextPage).toBe(true);
    expect(res.customer.automationConnection.pageInfo.nextPageOffset).toBe(5);

    // Go to next page
    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 5, perPage: 5 },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.automationConnection.totalPages).toBe(5);
    expect(res.customer.automationConnection.pageInfo.hasPrevPage).toBe(true);
    expect(res.customer.automationConnection.pageInfo.hasNextPage).toBe(true);
    expect(res.customer.automationConnection.pageInfo.nextPageOffset).toBe(10);
    expect(res.customer.automationConnection.pageInfo.pageIndex).toBe(1);
  });

  test('user can filter automation-connection by generic search', async () => {
    const { user, workspace, dialogue } = await prepDefaultCreateData(prisma);
    await seedAutomations(prisma, workspace, dialogue);

    const token = AuthService.createUserToken(user.id, 22);

    // Search by generic: automation label
    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { search: '2' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.automationConnection.totalPages).toBe(1);
    expect(res.customer.automationConnection.automations).toHaveLength(4); // 2, 12, 20 & 21

    // Search by generic: automation desciption
    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { search: 'AUTOMATION_DESCRIPTION_LOOKUP#20' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.automationConnection.totalPages).toBeGreaterThanOrEqual(1);
    expect(res.customer.automationConnection.automations.length).toBeGreaterThanOrEqual(1);
  });

  test('user can order automation-connection by updatedAt', async () => {
    const { user, workspace, dialogue } = await prepDefaultCreateData(prisma);
    await seedAutomations(prisma, workspace, dialogue, 3);

    const token = AuthService.createUserToken(user.id, 22);

    // Order by generic: updatedAt ascending
    let resAsc = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: {
        orderBy: {
          by: 'updatedAt',
          desc: false,
        },
      },
    }, { 'Authorization': `Bearer ${token}` });

    expect(resAsc.customer.automationConnection.totalPages).toBeGreaterThanOrEqual(1);
    expect(resAsc.customer.automationConnection.automations.length).toEqual(3);

    const firstAutomation = resAsc.customer.automationConnection.automations?.[0]
    const secondAutomation = resAsc.customer.automationConnection.automations?.[1]
    const thirdAutomation = resAsc.customer.automationConnection.automations?.[2]

    expect(firstAutomation?.updatedAt).toBeLessThan(secondAutomation?.updatedAt);
    expect(secondAutomation?.updatedAt).toBeLessThan(thirdAutomation?.updatedAt);

    // Order by generic: updatedAt descending
    let resDesc = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: {
        orderBy: {
          by: 'updatedAt',
          desc: true,
        },
      },
    }, { 'Authorization': `Bearer ${token}` });

    expect(resDesc.customer.automationConnection.totalPages).toBeGreaterThanOrEqual(1);
    expect(resDesc.customer.automationConnection.automations.length).toEqual(3);

    const firstAutomationDesc = resDesc.customer.automationConnection.automations?.[0]
    const secondAutomationDesc = resDesc.customer.automationConnection.automations?.[1]
    const thirdAutomationDesc = resDesc.customer.automationConnection.automations?.[2]

    expect(firstAutomationDesc?.updatedAt).toBeGreaterThan(secondAutomationDesc?.updatedAt);
    expect(secondAutomationDesc?.updatedAt).toBeGreaterThan(thirdAutomationDesc?.updatedAt);
  });
});
