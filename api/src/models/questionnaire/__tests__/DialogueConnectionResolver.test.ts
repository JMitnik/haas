import { clearDialogueDatabase, prepDefaultCreateData, seedDialogue, assignUserToDialogue } from './testUtils';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

import { prisma } from 'test/setup/singletonDeps';
const ctx = makeTestContext(prisma);


const Query = `
query dialogueConnection($customerSlug: String, $filter: DialogueConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    slug
    dialogueConnection(filter: $filter) {
      totalPages
      pageInfo {
        hasPrevPage
        hasNextPage
        prevPageOffset
        nextPageOffset
        pageIndex
      }
      dialogues {
        id
        title
        slug
      }
    }
  }
} 
`;

describe('DialogueConnection resolver', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  test('unable to query dialogue-connection unauthorized', async () => {
    const { user, workspace, userRole } = await prepDefaultCreateData(prisma);

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

  test('user can access dialogue-connection', async () => {
    const { user, workspace, dialogue } = await prepDefaultCreateData(prisma);
    await seedDialogue(prisma, workspace.id, 'dialogue_two');
    await seedDialogue(prisma, workspace.id, 'dialogue_three');
    await seedDialogue(prisma, workspace.id, 'dialogue_four');

    const token = AuthService.createUserToken(user.id, 22);

    const res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 0, perPage: 3 },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.dialogueConnection.totalPages).toBe(2);
    expect(res.customer.dialogueConnection.pageInfo.hasPrevPage).toBe(false);
    expect(res.customer.dialogueConnection.pageInfo.hasNextPage).toBe(true);

    // Go to next page
    const nextRes = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 3, perPage: 3 },
    }, { 'Authorization': `Bearer ${token}` });

    expect(nextRes.customer.dialogueConnection.totalPages).toBe(2);
    expect(nextRes.customer.dialogueConnection.pageInfo.hasPrevPage).toBe(true);
    expect(nextRes.customer.dialogueConnection.pageInfo.hasNextPage).toBe(false);
    expect(nextRes.customer.dialogueConnection.pageInfo.pageIndex).toBe(1);
  });

  test('Private dialogues are not shown if not assinged to user', async () => {
    const { user, workspace } = await prepDefaultCreateData(prisma);
    await seedDialogue(prisma, workspace.id, 'dialogue_two');
    await seedDialogue(prisma, workspace.id, 'dialogue_three', true);

    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 0, perPage: 2 },
    }, { 'Authorization': `Bearer ${token}` });

    // Although 3 dialogues created, only 2 should show up and therefore there is
    // only 1 page available dialogue connection 
    expect(res.customer.dialogueConnection.totalPages).toBe(1);
    expect(res.customer.dialogueConnection.pageInfo.hasPrevPage).toBe(false);
    expect(res.customer.dialogueConnection.pageInfo.hasNextPage).toBe(false);
  });

  test('Private dialogues are shown if assinged to user', async () => {
    const { user, workspace } = await prepDefaultCreateData(prisma);
    await seedDialogue(prisma, workspace.id, 'dialogue_two');
    const privateDialogue = await seedDialogue(prisma, workspace.id, 'dialogue_three', true);
    const token = AuthService.createUserToken(user.id, 22);

    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 0, perPage: 2 },
    }, { 'Authorization': `Bearer ${token}` });

    // Although 3 dialogues created, only 2 should show up and therefore there is
    // only 1 page available dialogue connection 
    expect(res.customer.dialogueConnection.totalPages).toBe(1);

    await assignUserToDialogue(prisma, privateDialogue.id, user.id);

    let resWithPrivate = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { offset: 0, perPage: 2 },
    }, { 'Authorization': `Bearer ${token}` });

    // Now that user is assigned to private dialogue it should appear in connection 
    // and therefor there will be 2 pages now
    expect(resWithPrivate.customer.dialogueConnection.totalPages).toBe(2);

  });

  test('user can filter dialogue-connection by generic search', async () => {
    const { user, workspace, dialogue } = await prepDefaultCreateData(prisma);
    await seedDialogue(prisma, workspace.id, 'dialogue_two', false, 'sear');
    await seedDialogue(prisma, workspace.id, 'dialogue_three', false, 'sear');
    await seedDialogue(prisma, workspace.id, 'dialogue_four', false, 'nope', 'description_test');
    await seedDialogue(prisma, workspace.id, 'dialogue_five', false, 'nope', 'descr_test');
    await seedDialogue(prisma, workspace.id, 'dialogue_six', false, 'nope', 'descri_test');

    const token = AuthService.createUserToken(user.id, 22);

    // Search by generic: dialogue title
    let res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { searchTerm: 'sear' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.dialogueConnection.totalPages).toBe(1);
    expect(res.customer.dialogueConnection.dialogues).toHaveLength(2);

    // Search by generic: dialogue desciption
    res = await ctx.client.request(Query, {
      customerSlug: workspace.slug,
      filter: { searchTerm: 'desc' },
    }, { 'Authorization': `Bearer ${token}` });

    expect(res.customer.dialogueConnection.dialogues).toHaveLength(3)
  });


});
