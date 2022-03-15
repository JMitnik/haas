import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { clearDialogueDatabase } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prepDefaultCreateData, seedSession } from './testUtils';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

describe('DialogueStatisticsSummary', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  it('can calculate dialogue impact value for all sessions', async () => {
    const { user, workspace, dialogue, sliderQuestion, choiceQuestion } = await prepDefaultCreateData(prisma);
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 70, choiceQuestion.id, 'Facilities');
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 10, choiceQuestion.id, 'Facilities');
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 40, choiceQuestion.id, 'Facilities');

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const res = await ctx.client.request(`
      query customer {
        customer(slug: "${workspace.slug}") {
          dialogue(where: { slug: "${dialogue.slug}"}) {
            id
            slug
            dialogueStatisticsSummary {
              nrVotes
              impactScore(type: AVERAGE)
            }
          }
        }
      }
    `,
      undefined,
      {
        'Authorization': `Bearer ${token}`,
      }
    ).then((data) => data?.customer?.dialogue.dialogueStatisticsSummary);

    expect(res).toMatchObject({
      nrVotes: 3,
      impactScore: 40,
    });
  });

  it('can calculate impact score based on scoped sessions', async () => {
    const { user, workspace, dialogue, sliderQuestion, choiceQuestion } = await prepDefaultCreateData(prisma);
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 70, choiceQuestion.id, 'Facilities', '2022-03-01T06:33:27.899Z');
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 10, choiceQuestion.id, 'Facilities', '2022-03-02T06:33:27.899Z');
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 40, choiceQuestion.id, 'Facilities', '2022-03-03T06:33:27.899Z');

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const resWithin = await ctx.client.request(`
      query customer {
        customer(slug: "${workspace.slug}") {
          dialogue(where: { slug: "${dialogue.slug}"}) {
            id
            slug
            dialogueStatisticsSummary(
              startDateTime: "2022-03-02T06:33:26.899Z",
              endDateTime: "2022-03-03T06:33:28.899Z") {
              nrVotes
              impactScore(type: AVERAGE)
            }
          }
        }
      }
    `,
      undefined
      ,
      {
        'Authorization': `Bearer ${token}`,
      }
    ).then((data) => data?.customer?.dialogue.dialogueStatisticsSummary);

    expect(resWithin).toMatchObject({
      nrVotes: 2,
      impactScore: 25,
    });

    const resStart = await ctx.client.request(`
      query customer {
        customer(slug: "${workspace.slug}") {
          dialogue(where: { slug: "${dialogue.slug}"}) {
            id
            slug
            dialogueStatisticsSummary(
              startDateTime: "2022-03-03T06:33:24.899Z") {
              nrVotes
              impactScore(type: AVERAGE)
            }
          }
        }
      }
    `,
      undefined
      ,
      {
        'Authorization': `Bearer ${token}`,
      }
    ).then((data) => data?.customer?.dialogue.dialogueStatisticsSummary);

    expect(resStart).toMatchObject({
      nrVotes: 1,
      impactScore: 40,
    });

    const resEnd = await ctx.client.request(`
      query customer {
        customer(slug: "${workspace.slug}") {
          dialogue(where: { slug: "${dialogue.slug}"}) {
            id
            slug
            dialogueStatisticsSummary(
              endDateTime: "2022-03-02T06:33:26.899Z") {
              nrVotes
              impactScore(type: AVERAGE)
            }
          }
        }
      }
    `,
      undefined
      ,
      {
        'Authorization': `Bearer ${token}`,
      }
    ).then((data) => data?.customer?.dialogue.dialogueStatisticsSummary);

    expect(resEnd).toMatchObject({
      nrVotes: 1,
      impactScore: 70,
    });
  });

});
