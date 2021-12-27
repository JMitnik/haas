import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { } from './testData';
import { clearDatabase } from './testUtils';
import AutomationService from '../AutomationService';
import { SetupQuestionCompareDataInput } from '../AutomationTypes';
import { NodeType, PrismaClient } from '@prisma/client';
import { sample } from 'lodash';

const prisma = makeTestPrisma();
const automationService = new AutomationService(prisma);

export const seedWorkspace = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      name: 'WORKSPACE',
      slug: 'WORKSPACE',
      dialogues: {
        create: {
          id: 'DIALOGUE_ID',
          description: 'desc',
          slug: 'DIALOGUE_SLUG',
          title: 'DIALOGUE',
        }
      }
    },
    include: {
      dialogues: true,
    }
  });
  const sliderQuestion = await seedQuestion(prisma, 'DIALOGUE_ID', 'SLIDER', 'SLIDER_ID');
  const choiceQuestion = await seedQuestion(prisma, 'DIALOGUE_ID', 'CHOICE', 'CHOICE_ID');
  return { workspace, sliderQuestion, choiceQuestion }
}

export const seedQuestion = (prisma: PrismaClient, dialogueId: string, type: NodeType, questionId: string) => {
  return prisma.questionNode.create({
    data: {
      id: questionId,
      title: 'QUESTION',
      type: type,
      questionDialogue: {
        connect: {
          id: dialogueId,
        }
      }
    }
  })
}

export const seedSession = async (
  prisma: PrismaClient,
  dialogueId: string,
  sliderQuestionId?: string,
  sliderValue?: number,
  choiceQuestionId?: string,
  choiceValue?: string,
) => {
  const session = prisma.session.create({
    data: {
      browser: sample(['Firefox', 'IEEdge', 'Chrome', 'Safari']),
      dialogueId,
      device: sample(['iPhone', 'Android', 'Mac', 'Windows ']),
      nodeEntries: {
        create: [{
          depth: 0,
          relatedNode: {
            create: !sliderQuestionId ? { title: 'Test', type: NodeType.SLIDER } : undefined,
            connect: sliderQuestionId ? { id: sliderQuestionId } : undefined,
          },
          sliderNodeEntry: {
            create: { value: sliderValue || Math.floor(Math.random() * 100) }
          },
        },
        {
          depth: 1,
          choiceNodeEntry: {
            create: {
              value: choiceValue || sample(['Customer support', 'Facilities', 'Website', 'Application']),
            }
          },
          relatedNode: {
            create: !choiceQuestionId ? { title: 'What did you think of this?', type: NodeType.CHOICE } : undefined,
            connect: choiceQuestionId ? { id: choiceQuestionId } : undefined,
          }
        }
        ],
      }
    }
  });

  return session;
}

describe('AutomationService', () => {
  beforeEach(async () => {
    await seedWorkspace(prisma);
  });

  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('Sets up compare data for slider-related node', async () => {
    // TODO: Prepare data: Slider node + 4 sessions where value is set (69,20,20,80) but only last 3 are used

    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 69, 'CHOICE_ID');
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 20, 'CHOICE_ID');
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 20, 'CHOICE_ID');
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 80, 'CHOICE_ID');

    const input: SetupQuestionCompareDataInput = {
      type: 'SLIDER',
      aspect: 'NODE_VALUE',
      matchValues: [{
        numberValue: 50,
        type: 'INT',
        automationConditionId: '',
        createdAt: new Date(Date.now()),
        dateTimeValue: null,
        textValue: null,
        updatedAt: null,
        id: '',
      }],
      questionId: 'SLIDER_ID',
      aggregate: {
        type: 'AVG',
        latest: 3,
        startDate: null,
        endDate: null,
        createdAt: new Date(Date.now()),
        dialogueConditionScopeId: null,
        id: '',
        questionConditionScopeId: '',
        workspaceConditionScopeId: null,
        updatedAt: null,
      }
    }

    const setupData = await automationService.setupSliderCompareData(input);
    expect(setupData?.totalEntries).toBe(4);
    expect(setupData?.matchValue).toBe(50);
    expect(setupData?.compareValue).toBe(40);
  });


});
