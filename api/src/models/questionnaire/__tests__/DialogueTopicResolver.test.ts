import { clearDialogueDatabase } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prepDefaultCreateData, seedSession } from './testUtils';

jest.setTimeout(30000);

import { prisma } from '../../../test/setup/singletonDeps';
const ctx = makeTestContext(prisma);


describe('Dialogue Topic', () => {
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

    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-01T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 70,
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
    });

    // This once is not used because it falls out of startDateTime + 7 days
    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-20T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 69,
    });

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const resWeekly = await ctx.client.request(`
    query dialogue {
      customer(slug: "${workspace.slug}") {
        id
        dialogue(where: { slug: "${dialogue.slug}"}) {
          topic(input: {
            impactScoreType: AVERAGE
            isRoot: true,
            value: "",
            startDateTime: "01-03-2022",
            refresh: true
          }) {
            name
            impactScore
            nrVotes
            subTopics {
              name
              impactScore
              nrVotes
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
    ).then((data) => data?.customer?.dialogue.topic);
    expect(resWeekly).toMatchObject({
      nrVotes: 3,
      impactScore: 40,
    });
    const subTopics: { name: string; impactScore: number; nrVotes: number }[] = resWeekly?.subTopics;
    expect(resWeekly?.subTopics).toHaveLength(3);

    // Expect only 2 entries to be available cus one falls out of provided ate range
    const facilitiesSubTopic = subTopics.find((subTopic) => subTopic.name === 'Facilities');
    expect(facilitiesSubTopic?.nrVotes).toBe(2);
    expect(facilitiesSubTopic?.impactScore).toBe(45);

    // Expect option that has never been answered to still be available
    const servicesSubTopic = subTopics.find((subTopic) => subTopic.name === 'Services');
    expect(servicesSubTopic).not.toBeUndefined();
    expect(servicesSubTopic?.nrVotes).toBe(0);
    expect(servicesSubTopic?.impactScore).toBe(0);
  });

  it('can find average impact scores of choice question sub topics', async () => {
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

    // This once is not used because it falls out of startDateTime + 7 days
    await seedSession({
      prisma,
      dialogueId: dialogue.id,
      sliderQuestionId: sliderQuestion.id,
      choiceQuestionId: choiceQuestion.id,
      choiceValue: 'Facilities',
      createdAt: '2022-03-20T06:33:27.899Z',
      edgeId: rootEdgeId,
      sliderValue: 69,
      subChoiceQuestionId: 'SUB_CHOICE_QUESTION_ONE_ID',
      subChoiceValue: 'Atmosphere',
      subEdgeId: facilitiesEdge?.id,
    });

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const resFacilities = await ctx.client.request(`
    query dialogue {
      customer(slug: "${workspace.slug}") {
        id
        dialogue(where: { slug: "${dialogue.slug}"}) {
          topic(input: {
            impactScoreType: AVERAGE
            isRoot: false,
            value: "Facilities",
            startDateTime: "01-03-2022",
            refresh: true
          }) {
            name
            impactScore
            nrVotes
            subTopics {
              name
              impactScore
              nrVotes
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
    ).then((data) => data?.customer?.dialogue.topic);
    expect(resFacilities).toMatchObject({
      name: 'Facilities',
      nrVotes: 2,
      impactScore: 45,
    });
    const subTopics: { name: string; impactScore: number; nrVotes: number }[] = resFacilities?.subTopics;
    expect(resFacilities?.subTopics).toHaveLength(2);

    // Expect only 2 entries to be available cus one falls out of provided ate range
    const facilitiesSubTopic = subTopics.find((subTopic) => subTopic.name === 'Atmosphere');
    expect(facilitiesSubTopic?.nrVotes).toBe(1);
    expect(facilitiesSubTopic?.impactScore).toBe(20);

    const resWebsite = await ctx.client.request(`
    query dialogue {
      customer(slug: "${workspace.slug}") {
        id
        dialogue(where: { slug: "${dialogue.slug}"}) {
          topic(input: {
            impactScoreType: AVERAGE
            isRoot: false,
            value: "Website",
            startDateTime: "01-03-2022",
            refresh: true
          }) {
            name
            impactScore
            nrVotes
            subTopics {
              name
              impactScore
              nrVotes
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
    ).then((data) => data?.customer?.dialogue.topic);

    const subTopicsWebsite: { name: string; impactScore: number; nrVotes: number }[] = resWebsite?.subTopics;
    expect(subTopicsWebsite).toHaveLength(2);

    // Expect option that has never been answered to still be available
    const responsiveSubTopic = subTopicsWebsite.find((subTopic) => subTopic.name === 'Responsive');
    expect(responsiveSubTopic).not.toBeUndefined();
    expect(responsiveSubTopic?.nrVotes).toBe(0);
    expect(responsiveSubTopic?.impactScore).toBe(0);
  });


});
