import { PrismaClient, SessionEventType } from '@prisma/client';

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

test('add single event', async () => {
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
          toNodeId: 'TEST_QUESTION_1',
        }]
      }
    },
  );

  const session = await sessionService.findSessionById(createdSession.id);
  expect(session.events).toHaveLength(1);
  expect(session.events[0].eventType).toEqual(SessionEventType.NAVIGATION);
});

test('add multiple events in one batch', async () => {
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
        events: [
          {
            eventType: 'NAVIGATION',
            sessionId: createdSession.id,
            timestamp: Date.now() - 10,
            toNodeId: 'TEST_QUESTION_1',
          },
          {
            eventType: 'SLIDER_ACTION',
            sessionId: createdSession.id,
            timestamp: Date.now() - 5,
            toNodeId: 'TEST_QUESTION_1',
            sliderValue: {
              value: 70,
              relatedNodeId: 'TEST_QUESTION_1',
              timeSpent: 10,
            }
          }
        ]
      }
    },
  );

  const session = await sessionService.findSessionById(createdSession.id);
  expect(session.events).toHaveLength(2);
  expect(session.events[0].eventType).toEqual(SessionEventType.NAVIGATION);
  expect(session.events[1].eventType).toEqual(SessionEventType.SLIDER_ACTION);
  expect(session.events[1].sliderValue.timeSpentInSec).toEqual(10);
  expect(session.events[1].sliderValue.value).toEqual(70);
});

test('retrieving multiple events from a session are sorted by timestamp', async () => {
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
        events: [
          {
            eventType: 'NAVIGATION',
            sessionId: createdSession.id,
            timestamp: Date.now() - 10,
            toNodeId: 'TEST_QUESTION_1',
          },
          {
            eventType: 'SLIDER_ACTION',
            sessionId: createdSession.id,
            timestamp: Date.now() - 30,
            toNodeId: 'TEST_QUESTION_1',
            sliderValue: {
              value: 70,
              relatedNodeId: 'TEST_QUESTION_1',
              timeSpent: 10,
            }
          }
        ]
      }
    },
  );

  const session = await sessionService.findSessionById(createdSession.id);
  expect(session.events).toHaveLength(2);

  // Even if navigation is sent first, the timestamp puts it "after" the slider event
  expect(session.events[0].eventType).toEqual(SessionEventType.SLIDER_ACTION);
  expect(session.events[1].eventType).toEqual(SessionEventType.NAVIGATION);
});
