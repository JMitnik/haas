import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, seedUser, seedWorkspace } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Mutation = `
mutation createSession($input: SessionInput) {
  createSession(input: $input) {
    id
  }
}
`;

describe('Create Session Resolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Can create actionable when session is negative', async () => {
    const { dialogue, sliderQuestion, choiceQuestion } = await seedWorkspace(prisma);

    const res = await ctx.client.request(Mutation,
      {
        input: {
          'dialogueId': dialogue.id,
          'deliveryId': '',
          'totalTimeInSec': 25,
          'originUrl': 'http://localhost:3000',
          'device': 'MacIntel',
          'entries': [
            {
              'nodeId': sliderQuestion.id,
              'depth': 0,
              'data': {
                'slider': {
                  'value': 21,
                },
              },
            },
            {
              'nodeId': choiceQuestion.id,
              'depth': 1,
              'data': {
                'choice': {
                  'value': 'Home',
                },
              },
            },
          ],
        },
      }
    );


    const sessionId: string = res?.createSession?.id;

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        actionable: {
          include: {
            issue: {
              include: {
                topic: true,
              },
            },
          },
        },
      },
    });

    expect(session?.actionableId).not.toBeNull();
    expect(session?.actionable?.issue?.topic.name).toBe('Home');
  });

});
