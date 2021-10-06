import { PrismaClient } from '@prisma/client';

import { clearDatabase } from './testUtils';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { seedDialogue, seedUser, seedWorkspace } from '../../../test/utils/seedTestData';
import AuthService from '../../auth/AuthService';
import { expectUnauthorizedErrorOnResolver } from '../../../test/utils/expects';
import { GraphQLResponse } from 'graphql-extensions';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

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

it('test user has permissions to access ', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);
  const { user } = await seedUser(prisma, workspace.id, ['CAN_VIEW_DIALOGUE']);
  const token = AuthService.createUserToken(user.id, 22);

  const res = await ctx.client.request(getSessionConnectionQuery,
    {
      customerSlug: workspace.slug,
      dialogueSlug: dialogue.slug
    },
    {
      'Authorization': `Bearer ${token}`
    }
  );

  expect(res.customer.dialogue.sessionConnection).not.toBeNull();
});

it('test user has no permissions to access interactions', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);
  const { user } = await seedUser(prisma, workspace.id, ['CAN_ADD_USERS']);
  const token = AuthService.createUserToken(user.id, 22);

  console.log(workspace.slug);

  try {
    await ctx.client.request(getSessionConnectionQuery,
      {
        customerSlug: workspace.slug,
        dialogueSlug: dialogue.slug
      },
      {
        'Authorization': `Bearer ${token}`
      }
    );
  } catch (error) {
    expect(error.response.errors).toHaveLength(1);
    expectUnauthorizedErrorOnResolver(error.response.errors[0], 'sessionConnection');
  }
});

