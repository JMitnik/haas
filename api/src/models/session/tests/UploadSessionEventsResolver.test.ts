import { PrismaClient } from '@prisma/client';

import { clearDatabase } from './testUtils';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { seedDialogue, seedUser, seedWorkspace } from '../../../test/utils/seedTestData';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

/**
 * Prepare the database by seeding, etc.
 * @param prisma
 * @returns
 */
const prepEnvironment = async (prisma: PrismaClient) => {
  const workspace = await seedWorkspace(prisma);
  const dialogue = await seedDialogue(prisma, workspace.id);

  return { workspace, dialogue };
}

const Mutation = `
  mutation ($input: UploadSessionEventsInput!) {
    uploadSessionEvents(input: $input) {
      status
    }
  }
`;

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

test('test simple append works', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);

  const res = await ctx.client.request(Mutation,
    // Variables
    {
      input: {
        sessionId: 'test'
      }
    },
  );

  console.log(res);
});
