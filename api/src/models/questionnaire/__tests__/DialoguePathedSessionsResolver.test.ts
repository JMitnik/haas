import { clearDialogueDatabase } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prepDefaultCreateData, seedSession } from './testUtils';

import { prisma } from '../../../test/setup/singletonDeps';
const ctx = makeTestContext(prisma);



describe('Dialogue Pathed Sessions', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });


  it('can find average impact scores of root question sub topics', async () => {
    const { user, workspace, dialogue, sliderQuestion, choiceQuestion } = await prepDefaultCreateData(prisma);
    const rootEdgeId = dialogue.questions[0].children[0].id;

    const facilitiesEdge = dialogue.edges.find((edge) => edge.conditions[0].matchValue === 'Facilities');
    const websiteEdge = dialogue.edges.find((edge) => edge.conditions[0].matchValue === 'Website');

    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-01T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 70,
      subChoiceQuestionId: 'SUB_CHOICE_QUESTION_ONE_ID',
      subChoiceValue: 'Cleanliness',
      subEdgeId: facilitiesEdge?.id,
    });

    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Website',
      createdAt: '2022-03-02T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 30,
      subChoiceQuestionId: 'SUB_CHOICE_QUESTION_TWO_ID',
      subChoiceValue: 'Speed',
      subEdgeId: websiteEdge?.id,
    });

    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-04T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 20,
      subChoiceQuestionId: 'SUB_CHOICE_QUESTION_ONE_ID',
      subChoiceValue: 'Atmosphere',
      subEdgeId: facilitiesEdge?.id,
    });

    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-05T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 40,
      subChoiceQuestionId: 'SUB_CHOICE_QUESTION_ONE_ID',
      subChoiceValue: 'Atmosphere',
      subEdgeId: facilitiesEdge?.id,
    });

    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-15T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 40,
      subChoiceQuestionId: 'SUB_CHOICE_QUESTION_ONE_ID',
      subChoiceValue: 'Atmosphere',
      subEdgeId: facilitiesEdge?.id,
    });

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const resRootWeekly = await ctx.client.request(`
    query dialogue {
      customer(slug: "${workspace.slug}") {
        id
        dialogue(where: { slug: "${dialogue.slug}"}) {
          pathedSessionsConnection(input: {
            path: ["Facilities"],
            refresh: true,
            startDateTime: "01-03-2022"
          }) {
            startDateTime
            endDateTime
            path
            pathedSessions {
              nodeEntries {
                value {
                  choiceNodeEntry
                }
              }
            }
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
    ).then((data) => data?.customer?.dialogue.pathedSessionsConnection.pathedSessions);

    // All with Facilities within date range
    expect(resRootWeekly).toHaveLength(3);

    const resSubWeekly = await ctx.client.request(`
    query dialogue {
      customer(slug: "${workspace.slug}") {
        id
        dialogue(where: { slug: "${dialogue.slug}"}) {
          pathedSessionsConnection(input: {
            path: ["Facilities", "Atmosphere"],
            refresh: true,
            startDateTime: "01-03-2022"
          }) {
            startDateTime
            endDateTime
            path
            pathedSessions {
              nodeEntries {
                value {
                  choiceNodeEntry
                }
              }
            }
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
    ).then((data) => data?.customer?.dialogue.pathedSessionsConnection.pathedSessions);

    // All with Facilities & Atmosphere
    expect(resSubWeekly).toHaveLength(2);

    const resNotFoundWeekly = await ctx.client.request(`
    query dialogue {
      customer(slug: "${workspace.slug}") {
        id
        dialogue(where: { slug: "${dialogue.slug}"}) {
          pathedSessionsConnection(input: {
            path: ["Facilities", "Atmosphere", "NOT_FOUND"],
            refresh: true,
            startDateTime: "01-03-2022"
          }) {
            startDateTime
            endDateTime
            path
            pathedSessions {
              nodeEntries {
                value {
                  choiceNodeEntry
                }
              }
            }
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
    ).then((data) => data?.customer?.dialogue.pathedSessionsConnection.pathedSessions);

    // All with Facilities & Atmosphere & NOT_FOUND
    expect(resNotFoundWeekly).toHaveLength(0);
  });

});
