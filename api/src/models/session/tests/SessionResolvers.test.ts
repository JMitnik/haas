import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server';

import { clearDatabase } from './testUtils';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { seedDialogue, seedSessions, seedUser, seedWorkspace } from '../../../test/utils/seedTestData';
import AuthService from '../../auth/AuthService';
import { expectUnauthorizedErrorOnResolver } from '../../../test/utils/expects';
import { defaultAdminRole, defaultManagerRole, defaultUserRole } from '../../templates/defaultWorkspaceTemplate';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

const prepEnvironment = async (prisma: PrismaClient) => {
  const workspace = await seedWorkspace(prisma);
  const dialogue = await seedDialogue(prisma, workspace.id);

  return { workspace, dialogue };
}

const getSessionConnectionQuery = `
  query GetInteractions(
    $customerSlug: String,
    $dialogueSlug: String,
    $sessionsFilter: SessionConnectionFilterInput
  ) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id

        campaignVariants {
          id
          label
        }
        sessionConnection(filter: $sessionsFilter) {
          sessions {
            id
          }

          totalPages

          pageInfo {
            hasPrevPage
            hasNextPage
            pageIndex
            nextPageOffset
            prevPageOffset
          }
        }
      }
    }
  }
`;

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

test('user has minimal permissions to access ', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);
  const { user } = await seedUser(prisma, workspace.id, {
    name: 'Reader',
    permissions: { set: ['CAN_VIEW_DIALOGUE'] },
  });
  const token = AuthService.createUserToken(user.id, 22);

  const res = await ctx.client.request(getSessionConnectionQuery,
    {
      customerSlug: workspace.slug,
      dialogueSlug: dialogue.slug,
    },
    {
      'Authorization': `Bearer ${token}`,
    }
  );

  expect(res.customer.dialogue.sessionConnection).not.toBeNull();
});

test('all default roles have permissions to access data', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);

  await Promise.all([defaultAdminRole, defaultManagerRole, defaultUserRole].map(async (role) => {
    const { user } = await seedUser(prisma, workspace.id, role);
    const token = AuthService.createUserToken(user.id, 22);
    const res = await ctx.client.request(getSessionConnectionQuery,
      {
        customerSlug: workspace.slug,
        dialogueSlug: dialogue.slug,
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );

    expect(res.customer.dialogue.sessionConnection).not.toBeNull();
  }));
});

test('user has no permissions to access interactions', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);
  const { user } = await seedUser(prisma, workspace.id, {
    name: 'Guest',
    permissions: { set: ['CAN_ADD_USERS'] },
  });
  const token = AuthService.createUserToken(user.id, 22);

  try {
    await ctx.client.request(getSessionConnectionQuery,
      {
        customerSlug: workspace.slug,
        dialogueSlug: dialogue.slug,
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );
  } catch (error) {
    if (error instanceof ApolloError) {
      expect(error.response.errors).toHaveLength(1);
      expectUnauthorizedErrorOnResolver(error.response.errors[0], 'sessionConnection');
    }
  }
});

test('sessionConnection performs pagination', async () => {
  const DEFAULT_NUMBER_SESSIONS_PER_PAGE = 5;
  const NUMBER_SESSIONS = 34;
  const NUMBER_PAGES_EXPECTED = 7;

  const { workspace, dialogue } = await prepEnvironment(prisma);

  await seedSessions(prisma, dialogue.id, NUMBER_SESSIONS);
  const { token } = await seedUser(prisma, workspace.id, {
    name: 'Reader',
    permissions: { set: ['CAN_VIEW_DIALOGUE'] },
  });

  const res = await ctx.client.request(getSessionConnectionQuery,
    {
      customerSlug: workspace.slug,
      dialogueSlug: dialogue.slug,
    },
    {
      'Authorization': `Bearer ${token}`,
    }
  );

  const sessionConnection = res.customer.dialogue.sessionConnection;

  // On initial page load
  expect(sessionConnection.sessions).toHaveLength(DEFAULT_NUMBER_SESSIONS_PER_PAGE);
  expect(sessionConnection.totalPages).toEqual(NUMBER_PAGES_EXPECTED);
  expect(sessionConnection.pageInfo.hasPrevPage).toBe(false);
  expect(sessionConnection.pageInfo.hasNextPage).toBe(true);
  expect(sessionConnection.pageInfo.pageIndex).toEqual(0);
  expect(sessionConnection.pageInfo.nextPageOffset).toEqual(5);
  expect(sessionConnection.pageInfo.prevPageOffset).toEqual(0);

  // Next pagination
  const nextRes = await ctx.client.request(getSessionConnectionQuery,
    {
      customerSlug: workspace.slug,
      dialogueSlug: dialogue.slug,
      sessionsFilter: {
        perPage: 5,
        offset: 5,
      },
    },
    {
      'Authorization': `Bearer ${token}`,
    }
  );

  const nextConnection = nextRes.customer.dialogue.sessionConnection;

  // On second page load
  expect(nextConnection.sessions).toHaveLength(DEFAULT_NUMBER_SESSIONS_PER_PAGE);
  expect(nextConnection.totalPages).toEqual(NUMBER_PAGES_EXPECTED);
  expect(nextConnection.pageInfo.hasPrevPage).toBe(true);
  expect(nextConnection.pageInfo.hasNextPage).toBe(true);
  expect(nextConnection.pageInfo.pageIndex).toEqual(1);
  expect(nextConnection.pageInfo.nextPageOffset).toEqual(10);
  expect(nextConnection.pageInfo.prevPageOffset).toEqual(0);
});
