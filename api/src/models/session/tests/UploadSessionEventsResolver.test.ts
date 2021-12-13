import { PrismaClient } from '@prisma/client';

import { clearDatabase } from './testUtils';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { seedDialogue, seedUser, seedWorkspace } from '../../../test/utils/seedTestData';
import AuthService from '../../auth/AuthService';
import { NexusGenFieldTypes, NexusGenInputs } from '../../../generated/nexus';
import SessionService from '../SessionService';

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

type MutationInput = { input: NexusGenInputs['UploadSessionEventsInput'] };

afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

test('test simple append works', async () => {
  const { workspace, dialogue } = await prepEnvironment(prisma);
  const sessionService = new SessionService(prisma);
  const createdSession = await sessionService.createSession({
    totalTimeInSec: 0,
    dialogueId: dialogue.id,
    entries: [],
  });

  const res = await ctx.client.request<any, MutationInput>(Mutation,
    // Variables
    {
      input: {
        sessionId: createdSession.id,
        events: [{
          eventType: 'NAVIGATION',
          sessionId: createdSession.id,
          timestamp: Date.now(),
          toNodeId: 'node1',
          choiceValue: {

          }
        }]
      }
    },
  );

  const session = await sessionService.findSessionById(createdSession.id);

  console.log(session);
});
