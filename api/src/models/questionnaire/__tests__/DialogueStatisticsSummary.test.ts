import { addSeconds, format } from 'date-fns';

import { isValidDateTime } from '../../../utils/isValidDate';
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

  it('can calculate impact score for last week', async () => {
    const { user, workspace, dialogue, sliderQuestion, choiceQuestion } = await prepDefaultCreateData(prisma);
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 70, choiceQuestion.id, 'Facilities', '2022-03-01T06:33:27.899Z');
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 30, choiceQuestion.id, 'Facilities', '2022-03-02T06:33:27.899Z');
    await seedSession(prisma, dialogue.id, sliderQuestion.id, 40, choiceQuestion.id, 'Facilities', '2022-03-10T06:33:27.899Z');

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const resStart = await ctx.client.request(`
      query customer {
        customer(slug: "${workspace.slug}") {
          dialogue(where: { slug: "${dialogue.slug}"}) {
            id
            slug
            dialogueStatisticsSummary(input: {
              startDateTime: "01-03-2022",
              impactType: AVERAGE
              }) {
              nrVotes
              impactScore
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
      nrVotes: 2,
      impactScore: 50,
    });
  });

  it('can calculate impact score within 2 days', async () => {
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
            dialogueStatisticsSummary(input: {
              startDateTime: "02-03-2022",
              endDateTime: "03-03-2022",
              impactType: AVERAGE
            }) {
              nrVotes
              impactScore
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
  });

});
