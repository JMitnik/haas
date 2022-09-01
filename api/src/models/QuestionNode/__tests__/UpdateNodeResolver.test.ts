import { clearDialogueDatabase, seedDialogue } from './testUtils';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prepDefaultCreateData } from './testUtils';

jest.setTimeout(30000);

import { prisma } from '../../../test/setup/singletonDeps';
const ctx = makeTestContext(prisma);

const Mutation = `
mutation updateQuestion($input: UpdateQuestionNodeInputType) {
  updateQuestion(input: $input) {
      id
  }
}
`

describe('Update Node Resolver', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });


  it('Can update single question', async () => {
    const { user, workspace, workspaceTwo, userRole } = await prepDefaultCreateData(prisma);

    await seedDialogue(prisma, workspace.id, 'DIALOGUE_ONE');
    await seedDialogue(prisma, workspace.id, 'DIALOGUE_TWO');

    await seedDialogue(prisma, workspaceTwo.id, 'DIALOGUE_THREE');
    await seedDialogue(prisma, workspaceTwo.id, 'DIALOGUE_FOUR');


    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const updateRes = await ctx.client.request(Mutation,
      {
        input: {
          id: 'DIALOGUE_ONE_NEGATIVE_CHOICE_QUESTION_ID',
          customerId: workspace.id,
          overrideLeafId: 'DIALOGUE_ONE_CTA',
          edgeId: 'DIALOGUE_ONE_NEGATIVE_EDGE',
          title: 'What went wrong?',
          type: 'CHOICE',
          unhappyText: null,
          happyText: null,
          updateSameTemplate: false,
          optionEntries: {
            options: [
              {
                value: 'Facility',
                publicValue: 'Facility',
                position: 1,
                isTopic: true,
                overrideLeafId: 'DIALOGUE_ONE_CTA',
              },
              {
                value: 'Website',
                publicValue: 'Website',
                position: 2,
                isTopic: true,
              },
              {
                value: 'Services',
                publicValue: 'Services',
                position: 3,
                isTopic: true,
              },
            ],
          },
          edgeCondition: {
            conditionType: 'valueBoundary',
            renderMin: 0,
            renderMax: 25,
            matchValue: null,
          },
        },
      }
      ,
      {
        'Authorization': `Bearer ${token}`,
      }
    ).then((data) => data);

    const updatedDialogue = await prisma.dialogue.findUnique({
      where: {
        slug_customerId: {
          customerId: workspace.id,
          slug: 'DIALOGUE_ONE',
        },
      },
      include: {
        edges: {
          include: {
            conditions: true,
          },
        },
        questions: {
          include: {
            children: {
              include: {
                conditions: true,
              },
            },
            options: true,
          },
        },
      },
    });

    const targetQuestion = updatedDialogue?.questions.find((question) => question.id === 'DIALOGUE_ONE_NEGATIVE_CHOICE_QUESTION_ID');
    expect(targetQuestion?.title).toBe('What went wrong?');
    expect(targetQuestion?.type).toBe('CHOICE');
    expect(targetQuestion?.overrideLeafId).toBe('DIALOGUE_ONE_CTA');

    expect(targetQuestion?.options).toHaveLength(3);
    expect(targetQuestion?.options?.find(
      (option) => option.value === 'Facility')?.overrideLeafId).toBe('DIALOGUE_ONE_CTA');

    const targetEdge = updatedDialogue?.edges.find((edge) => edge.id === 'DIALOGUE_ONE_NEGATIVE_EDGE');
    expect(targetEdge?.conditions?.[0]).toMatchObject({
      conditionType: 'valueBoundary',
      renderMin: 0,
      renderMax: 25,
      matchValue: null,
    });


  });

  it('Can update questions with same template', async () => {
    const { user, workspace, workspaceTwo, userRole } = await prepDefaultCreateData(prisma);

    await seedDialogue(prisma, workspace.id, 'DIALOGUE_ONE');
    await seedDialogue(prisma, workspace.id, 'DIALOGUE_TWO');

    await seedDialogue(prisma, workspaceTwo.id, 'DIALOGUE_THREE');
    await seedDialogue(prisma, workspaceTwo.id, 'DIALOGUE_FOUR');


    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    const updateRes = await ctx.client.request(Mutation,
      {
        input: {
          id: 'DIALOGUE_ONE_NEGATIVE_CHOICE_QUESTION_ID',
          customerId: workspace.id,
          overrideLeafId: 'DIALOGUE_ONE_CTA',
          edgeId: 'DIALOGUE_ONE_NEGATIVE_EDGE',
          title: 'What went wrong?',
          type: 'CHOICE',
          unhappyText: null,
          happyText: null,
          updateSameTemplate: true,
          optionEntries: {
            options: [
              {
                value: 'Facility',
                publicValue: 'Facility',
                position: 1,
                isTopic: true,
                overrideLeafId: 'DIALOGUE_ONE_CTA',
              },
              {
                value: 'Website',
                publicValue: 'Website',
                position: 2,
                isTopic: true,
              },
              {
                value: 'Services',
                publicValue: 'Services',
                position: 3,
                isTopic: true,
              },
            ],
          },
          edgeCondition: {
            conditionType: 'valueBoundary',
            renderMin: 0,
            renderMax: 25,
            matchValue: null,
          },
        },
      }
      ,
      {
        'Authorization': `Bearer ${token}`,
      }
    ).then((data) => data);

    const updatedDialogue = await prisma.dialogue.findUnique({
      where: {
        slug_customerId: {
          customerId: workspace.id,
          slug: 'DIALOGUE_ONE',
        },
      },
      include: {
        edges: {
          include: {
            conditions: true,
          },
        },
        questions: {
          include: {
            children: {
              include: {
                conditions: true,
              },
            },
            options: true,
          },
        },
      },
    });

    const targetQuestion = updatedDialogue?.questions.find((question) => question.id === 'DIALOGUE_ONE_NEGATIVE_CHOICE_QUESTION_ID');
    expect(targetQuestion?.title).toBe('What went wrong?');
    expect(targetQuestion?.type).toBe('CHOICE');
    expect(targetQuestion?.overrideLeafId).toBe('DIALOGUE_ONE_CTA');

    expect(targetQuestion?.options).toHaveLength(3);
    expect(targetQuestion?.options?.find(
      (option) => option.value === 'Facility')?.overrideLeafId).toBe('DIALOGUE_ONE_CTA');

    const targetEdge = updatedDialogue?.edges.find((edge) => edge.id === 'DIALOGUE_ONE_NEGATIVE_EDGE');
    expect(targetEdge?.conditions?.[0]).toMatchObject({
      conditionType: 'valueBoundary',
      renderMin: 0,
      renderMax: 25,
      matchValue: null,
    });

    const colletoralUpdatedDialogue = await prisma.dialogue.findUnique({
      where: {
        slug_customerId: {
          customerId: workspace.id,
          slug: 'DIALOGUE_TWO',
        },
      },
      include: {
        edges: {
          include: {
            conditions: true,
          },
        },
        questions: {
          include: {
            children: {
              include: {
                conditions: true,
              },
            },
            options: true,
          },
        },
      },
    });

    const targetQuestionTwo = colletoralUpdatedDialogue?.questions.find((question) => question.id === 'DIALOGUE_TWO_NEGATIVE_CHOICE_QUESTION_ID');
    expect(targetQuestionTwo?.title).toBe('What went wrong?');
    expect(targetQuestionTwo?.type).toBe('CHOICE');
    expect(targetQuestionTwo?.overrideLeafId).toBe('DIALOGUE_TWO_CTA');

    expect(targetQuestionTwo?.options).toHaveLength(3);
    expect(targetQuestionTwo?.options?.find(
      (option) => option.value === 'Facility')?.overrideLeafId).toBe('DIALOGUE_TWO_CTA');

    const targetEdgeTwo = colletoralUpdatedDialogue?.edges.find((edge) => edge.id === 'DIALOGUE_TWO_NEGATIVE_EDGE');
    expect(targetEdgeTwo?.conditions?.[0]).toMatchObject({
      conditionType: 'valueBoundary',
      renderMin: 0,
      renderMax: 25,
      matchValue: null,
    });


  });

});
