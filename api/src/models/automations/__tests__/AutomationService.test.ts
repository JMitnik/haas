import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { choiceQuestionCompareDataInput, sliderQuestionCompareDataInput } from './testData';
import { clearDatabase } from './testUtils';
import AutomationService from '../AutomationService';
import { AutomationCondition, SetupQuestionCompareDataInput } from '../AutomationTypes';
import { NodeType, PrismaClient } from '@prisma/client';
import { map, sample } from 'lodash';

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
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 69, 'CHOICE_ID', 'Kaas');
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 20, 'CHOICE_ID', 'Facilities');
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 20, 'CHOICE_ID', 'Facilities');
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 80, 'CHOICE_ID', 'Something');
  });

  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test('Sets up compare data for slider-related node', async () => {
    const setupData = await automationService.setupSliderCompareData(sliderQuestionCompareDataInput);

    expect(setupData?.totalEntries).toBe(4);
    expect(setupData?.matchValue).toBe(50);
    expect(setupData?.compareValue).toBe(40);
  });

  test('Sets up compare data for choice-related node', async () => {
    const setupData = await automationService.setupChoiceCompareData(choiceQuestionCompareDataInput);
    expect(setupData?.totalEntries).toBe(4);
    expect(setupData?.matchValue).toBe(2);

    // Finds two facilities in the last 3 entries
    expect(setupData?.compareValue).toBe(2);
  });

  test('Sets up correct compare data based on question type', async () => {
    const choiceDataInput = choiceQuestionCompareDataInput;
    const sliderDataInput = sliderQuestionCompareDataInput;

    const sliderSetupData = await automationService.setupQuestionCompareData(sliderDataInput);
    expect(sliderSetupData?.totalEntries).toBe(4);
    expect(sliderSetupData?.matchValue).toBe(50);
    expect(sliderSetupData?.compareValue).toBe(40);

    const choiceSetupData = await automationService.setupQuestionCompareData(choiceDataInput);
    expect(choiceSetupData?.totalEntries).toBe(4);
    expect(choiceSetupData?.matchValue).toBe(2);

    // Finds two facilities in the last 3 entries
    expect(choiceSetupData?.compareValue).toBe(2);
  });

  test('Validates an automation condition (scope = QUESTION, type = SLIDER, Operator = SMALLER_OR_EQUAL_THAN)', async () => {
    const condition: AutomationCondition = {
      dialogue: null,
      dialogueScope: null,
      id: '',
      scope: 'QUESTION',
      operator: 'SMALLER_OR_EQUAL_THAN',
      workspaceScope: null,
      matchValues: [
        {
          numberValue: 80,
          type: 'INT',
          automationConditionId: '',
          createdAt: new Date(Date.now()),
          dateTimeValue: null,
          textValue: null,
          updatedAt: null,
          id: '',
        }
      ],
      question: {
        id: 'SLIDER_ID',
        title: 'slider',
        type: 'SLIDER',
        creationDate: new Date(Date.now()),
        edgeId: '',
        formNodeId: '',
        isLeaf: false,
        isRoot: true,
        videoEmbeddedNodeId: null,
        updatedAt: new Date(Date.now()),
        overrideLeafId: null,
        questionDialogueId: 'DIALOGUE_ID',
        sliderNodeId: null,
      },
      questionScope: {
        aggregate: {
          type: 'AVG',
          latest: 4,
          startDate: null,
          endDate: null,
          createdAt: new Date(Date.now()),
          dialogueConditionScopeId: null,
          id: '',
          questionConditionScopeId: '',
          workspaceConditionScopeId: null,
          updatedAt: null,
        },
        aspect: 'NODE_VALUE',
        automationConditionId: '',
        createdAt: new Date(Date.now()),
        id: '',
        updatedAt: null,
      }

    }
    // Average is indeed lower than 80 => condition resolved
    const succesfullValidation = await automationService.validateQuestionScopeCondition(condition);
    expect(succesfullValidation).toBe(true);

    // Average is higher than 20 => condition rejected
    condition.matchValues[0].numberValue = 20;
    const unsuccesfullValidation = await automationService.validateQuestionScopeCondition(condition);
    expect(unsuccesfullValidation).toBe(false);

    // Average is lower than 80 but doesn't get by batch check => condition reject
    condition.matchValues[0].numberValue = 80;
    await seedSession(prisma, 'DIALOGUE_ID', 'SLIDER_ID', 40, 'CHOICE_ID', 'Something');

    const batchCheckValidation = await automationService.validateQuestionScopeCondition(condition);
    expect(batchCheckValidation).toBe(false);
  });

});
