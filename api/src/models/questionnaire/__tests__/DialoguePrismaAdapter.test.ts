import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import DialoguePrismaAdapter from '../DialoguePrismaAdapter';
import { clearDialogueDatabase } from './testUtils';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';
import { CreateDialogueInput } from '../DialoguePrismaAdapterType';

const prisma = makeTestPrisma();
const dialoguePrismaAdapter = new DialoguePrismaAdapter(prisma);

const defaultDialogueCreateInput: Prisma.DialogueCreateInput = {
  title: 'DEFAULT_DIALOGUE',
  slug: 'default',
  description: 'description',
  customer: {
    create: {
      name: 'DEFAULT_CUSTOMER',
      slug: 'customerSlug',
    },
  },
}

const defaultCreateDialogueInput: CreateDialogueInput = {
  title: 'DEFAULT_DIALOGUE',
  slug: 'default',
  description: 'description',
  customer: {
    name: 'DEFAULT_CUSTOMER',
    slug: 'customerSlug',
    create: true,
  },
}

describe('DialoguePrismaAdapter', () => {
  afterEach(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearDialogueDatabase(prisma);
    await prisma.$disconnect();
  });


  test('Creates a dialogue', async () => {
    const dialogue = await dialoguePrismaAdapter.createTemplate(defaultCreateDialogueInput);
    expect(dialogue).not.toBeNull();
    expect(dialogue?.title).toBe(defaultDialogueCreateInput.title);
    expect(dialogue?.slug).toBe(defaultDialogueCreateInput.slug);
    expect(dialogue?.customer?.name).toBe(defaultCreateDialogueInput?.customer?.name);
    expect(dialogue?.customer?.slug).toBe(defaultCreateDialogueInput?.customer?.slug);
  });

  test('Deletes a dialogue', async () => {
    const dialogue = await dialoguePrismaAdapter.create({ data: defaultDialogueCreateInput });
    const dialogues = await prisma.dialogue.findMany();
    expect(dialogues).toHaveLength(1);

    await dialoguePrismaAdapter.delete(dialogue.id);
    const noDialogues = await prisma.dialogue.findMany();
    expect(noDialogues).toHaveLength(0);
  });

  test('Finds dialogue ids of workspace by workspace ID', async () => {
    await dialoguePrismaAdapter.create({ data: defaultDialogueCreateInput });
    const targetDialogueOne = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_ONE',
        slug: 'targetSlugOne',
        description: 'description',
        customer: {
          create: {
            name: 'TARGET_CUSTOMER',
            slug: 'TARGET_CUSTOMER_SLUG',
          },
        },
      },
    });

    await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_TWO',
        slug: 'targetSlugTwo',
        description: '',
        customer: {
          connect: {
            id: targetDialogueOne.customerId,
          },
        },
      },
    });

    const dialogueIds = await dialoguePrismaAdapter.findDialogueIdsOfCustomer(targetDialogueOne.customerId);
    expect(dialogueIds).toHaveLength(2);
  });

  test('Finds dialogues of a workspace by dialogue id', async () => {
    await dialoguePrismaAdapter.create({ data: defaultDialogueCreateInput });
    const targetDialogueOne = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_ONE',
        slug: 'targetSlugOne',
        description: 'description',
        customer: {
          create: {
            name: 'TARGET_CUSTOMER',
            slug: 'TARGET_CUSTOMER_SLUG',
          },
        },
      },
    });

    const targetDialogueTwo = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_TWO',
        slug: 'targetSlugTwo',
        description: '',
        customer: {
          connect: {
            id: targetDialogueOne.customerId,
          },
        },
      },
    });
    const dialogues = await dialoguePrismaAdapter.findDialoguesByCustomerId(targetDialogueOne.customerId);
    expect(dialogues).toHaveLength(2);
    const dialogueSlugOne = dialogues.find((dialogue) => dialogue.slug === targetDialogueOne.slug);
    expect(dialogueSlugOne).not.toBeUndefined();
    const dialogueSlugTwo = dialogues.find((dialogue) => dialogue.slug === targetDialogueTwo.slug);
    expect(dialogueSlugTwo).not.toBeUndefined();
  });

  test('Finds CTAs of a dialogue by ID', async () => {
    const targetDialogueOne = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_ONE',
        slug: 'targetSlugOne',
        description: 'description',
        questions: {
          create: [
            {
              title: 'normalQuestion1',
              type: 'SLIDER',
              isLeaf: false,
            },
            {
              title: 'cta1',
              type: 'FORM',
              isLeaf: true,
            },
            {
              title: 'normalQuestion2',
              type: 'CHOICE',
              isLeaf: false,
            },
            {
              title: 'cta2',
              type: 'SHARE',
              isLeaf: true,
            },
          ],
        },
        customer: {
          create: {
            name: 'TARGET_CUSTOMER',
            slug: 'TARGET_CUSTOMER_SLUG',
          },
        },
      },
    });

    const ctas = await dialoguePrismaAdapter.getCTAsByDialogueId(targetDialogueOne.id);
    expect(ctas).toHaveLength(2);
    const formCTA = ctas.find((cta) => cta.type === 'FORM');
    expect(formCTA).not.toBeUndefined();
    const shareCTA = ctas.find((cta) => cta.type === 'SHARE');
    expect(shareCTA).not.toBeUndefined();
  });

  test('Finds dialogue by ID', async () => {
    const dialogue = await dialoguePrismaAdapter.create({ data: defaultDialogueCreateInput });
    const notFoundDialogue = await dialoguePrismaAdapter.getDialogueById('-1');
    expect(notFoundDialogue).toBeNull();
    const foundDialogue = await dialoguePrismaAdapter.getDialogueById(dialogue.id);
    expect(foundDialogue).not.toBeNull();
  });

  test('Finds the dialogue by the ID of question node attached to it', async () => {
    await prisma.dialogue.create({
      data: defaultDialogueCreateInput,
      include: {
        questions: true,
      },
    });
    const targetDialogueOne = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_ONE',
        slug: 'targetSlugOne',
        description: 'description',
        questions: {
          create: [
            {
              title: 'normalQuestion1',
              type: 'SLIDER',
              isLeaf: false,
            },
          ],
        },
        customer: {
          create: {
            name: 'TARGET_CUSTOMER',
            slug: 'TARGET_CUSTOMER_SLUG',
          },
        },
      },
      include: {
        questions: true,
      },
    });

    const notFoundDialogue = await dialoguePrismaAdapter.getDialogueByQuestionNodeId('-1');
    expect(notFoundDialogue).toBeNull();

    const foundDialogue = await dialoguePrismaAdapter.getDialogueByQuestionNodeId(targetDialogueOne.questions[0].id);
    expect(foundDialogue).not.toBeNull();
    expect(foundDialogue?.slug).toBe(targetDialogueOne.slug);
  });

  test('Finds dialogue by workspace ID and dialogue slug', async () => {
    await dialoguePrismaAdapter.create({ data: defaultDialogueCreateInput });
    const targetDialogueOne = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_ONE',
        slug: 'targetSlugOne',
        description: 'description',
        customer: {
          create: {
            name: 'TARGET_CUSTOMER',
            slug: 'TARGET_CUSTOMER_SLUG',
          },
        },
      },
    });

    // customer id is incorrect, dialogueSlug is correct
    const dialogueNotFoundIncorrectCustomerId = await dialoguePrismaAdapter.getDialogueBySlug('-1', targetDialogueOne.slug);
    expect(dialogueNotFoundIncorrectCustomerId).toBeNull();

    // customer id is correct, dialogueSlug is incorrect
    const dialogueNotFoundIncorrectDialogueSlug = await dialoguePrismaAdapter.getDialogueBySlug(targetDialogueOne.customerId, '-1');
    expect(dialogueNotFoundIncorrectDialogueSlug).toBeNull();

    const foundDialogue = await dialoguePrismaAdapter.getDialogueBySlug(targetDialogueOne.customerId, targetDialogueOne.slug);
    expect(foundDialogue).not.toBeNull();
    expect(foundDialogue?.title).toBe(targetDialogueOne.title);
  });

  test('Finds dialogue by workspace slug and dialogue slug', async () => {
    await dialoguePrismaAdapter.create({ data: defaultDialogueCreateInput });
    const targetDialogueOne = await prisma.dialogue.create({
      data: {
        title: 'TARGET_DIALOGUE_ONE',
        slug: 'targetSlugOne',
        description: 'description',
        customer: {
          create: {
            name: 'TARGET_CUSTOMER',
            slug: 'TARGET_CUSTOMER_SLUG',
          },
        },
      },
      include: {
        customer: true,
      },
    });

    // correct customer slug, incorrect dialogue slug
    const notFoundDialogueIncorrectDialogueSlug = await dialoguePrismaAdapter.getDialogueBySlugs(targetDialogueOne.customer.slug, 'none');
    expect(notFoundDialogueIncorrectDialogueSlug).toBeNull();

    // incorrect customer slug, correct dialogue slug
    const notFoundDialogueIncorrectCustomerSlug = await dialoguePrismaAdapter.getDialogueBySlugs('none', targetDialogueOne.slug);
    expect(notFoundDialogueIncorrectCustomerSlug).toBeNull();

    // correct customer slug, correct dialogue slug
    const foundDialogue = await dialoguePrismaAdapter.getDialogueBySlugs(targetDialogueOne.customer.slug, targetDialogueOne.slug);
    expect(foundDialogue).not.toBeNull();
    expect(foundDialogue?.title).toBe(targetDialogueOne.title);
  });

  test('Finds dialogue with corresponding nodes and edges', async () => {
    const dialogueId = cuid();
    const dialogueCreateInputWithEdgesAndQuestions: Prisma.DialogueCreateInput = {
      ...defaultDialogueCreateInput,
      id: dialogueId,
      questions: {
        create: {
          title: 'firstQuestion',
        },
      },
      edges: {
        create: {
          parentNode: {
            create: {
              title: 'parentQuestion',
              type: 'SLIDER',
              questionDialogue: {
                connect: {
                  id: dialogueId,
                },
              },
            },
          },
          childNode: {
            create: {
              title: 'childQUestion',
              type: 'CHOICE',
              questionDialogue: {
                connect: {
                  id: dialogueId,
                },
              },
            },
          },
        },
      },
    }
    const dialogue = await prisma.dialogue.create({ data: dialogueCreateInputWithEdgesAndQuestions });
    const foundDialogue = await dialoguePrismaAdapter.getDialogueWithNodesAndEdges(dialogue.id);

    expect(foundDialogue?.edges).toHaveLength(1);
    expect(foundDialogue?.questions).toHaveLength(3);
  });

  test('Finds all edges by dialogue ID', async () => {
    const defaultDialogueId = cuid();
    const dialogueCreateInputWithEdgesAndQuestions: Prisma.DialogueCreateInput = {
      ...defaultDialogueCreateInput,
      id: defaultDialogueId,
      questions: {
        create: {
          title: 'firstQuestion',
        },
      },
      edges: {
        create: {
          parentNode: {
            create: {
              title: 'parentQuestion',
              type: 'SLIDER',
              questionDialogue: {
                connect: {
                  id: defaultDialogueId,
                },
              },
            },
          },
          childNode: {
            create: {
              title: 'childQUestion',
              type: 'CHOICE',
              questionDialogue: {
                connect: {
                  id: defaultDialogueId,
                },
              },
            },
          },
        },
      },
    };

    await dialoguePrismaAdapter.create({ data: dialogueCreateInputWithEdgesAndQuestions });

    const edgesTestDialogueId = cuid();
    const edgesTestDialogueInput: Prisma.DialogueCreateInput = {
      id: edgesTestDialogueId,
      title: 'DEFAULT_DIALOGUE',
      slug: 'edgesTest',
      description: 'description',
      customer: {
        create: {
          name: 'EDGES_CUSTOMER',
          slug: 'customerEdgesSlug',
        },
      },
      edges: {
        create: [
          {
            parentNode: {
              create: {
                title: 'parentNodeOne',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
            childNode: {
              create: {
                title: 'childNodeOne',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
          },
          {
            parentNode: {
              create: {
                title: 'parentNodeTwo',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
            childNode: {
              create: {
                title: 'childNodeTwo',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
          },
        ],
      },
    }

    const dialogueWithEdges = await dialoguePrismaAdapter.create({ data: edgesTestDialogueInput });
    const foundEdges = await dialoguePrismaAdapter.getEdgesByDialogueId(dialogueWithEdges.id);
    expect(foundEdges).toHaveLength(2);
  });

  test('Finds all questions by dialogue ID', async () => {
    const defaultDialogueWithQuestionCreateInput: Prisma.DialogueCreateInput = {
      ...defaultDialogueCreateInput,
      questions: {
        create: [
          { title: 'defaultQuestion' },
        ],
      },
    };

    await dialoguePrismaAdapter.create({ data: defaultDialogueWithQuestionCreateInput });

    const questionsDialogueCreateInput: Prisma.DialogueCreateInput = {
      title: 'questionsDialogue',
      slug: 'questionsTest',
      description: 'description',
      customer: {
        create: {
          name: 'QUESTION_CUSTOMER',
          slug: 'customerQuestionsSlug',
        },
      },
      questions: {
        create: [
          { title: 'targetOne' },
          { title: 'targetTwo' },
        ],
      },
    };

    const questionsDialogue = await dialoguePrismaAdapter.create({ data: questionsDialogueCreateInput });
    const questions = await dialoguePrismaAdapter.getQuestionsByDialogueId(questionsDialogue.id);
    expect(questions).toHaveLength(2);
    const targetOneQuestion = questions.find((question) => question.title === 'targetOne');
    expect(targetOneQuestion).not.toBeUndefined();
  });

  test('Finds the root question of a dialogue by dialogue ID', async () => {
    const defaultDialogueWithQuestionCreateInput: Prisma.DialogueCreateInput = {
      ...defaultDialogueCreateInput,
      questions: {
        create: [
          { title: 'defaultQuestion', isRoot: true },
        ],
      },
    };

    await dialoguePrismaAdapter.create({ data: defaultDialogueWithQuestionCreateInput });

    const targetDialogueCreateInput: Prisma.DialogueCreateInput = {
      title: 'questionsDialogue',
      slug: 'questionsTest',
      description: 'description',
      customer: {
        create: {
          name: 'QUESTION_CUSTOMER',
          slug: 'customerQuestionsSlug',
        },
      },
      questions: {
        create: [
          { title: 'normalQuestion' },
          { title: 'targetRootQuestion', isRoot: true },
        ],
      },
    }

    const targetRootQuestionDialogue = await dialoguePrismaAdapter.create({ data: targetDialogueCreateInput });

    const rootQuestion = await dialoguePrismaAdapter.getRootQuestionByDialogueId(targetRootQuestionDialogue.id);
    // TODO: Should I test (and thus create all different node types) that are part of the return type of the function
    expect(rootQuestion?.title).toBe('targetRootQuestion');
  });

  test('Finds the tags of a dialogue by dialogue ID', async () => {
    const defaultTagsDialogueInput: Prisma.DialogueCreateInput = {
      title: 'DEFAULT_DIALOGUE',
      slug: 'default',
      description: 'description',
      customer: {
        create: {
          name: 'DEFAULT_CUSTOMER',
          slug: 'customerSlug',
        },
      },
      tags: {
        create: [
          {
            name: 'defaultOne',
            customer: {
              connect: {
                slug: 'customerSlug',
              },
            },
          },
          {
            name: 'defaultTwo',
            customer: {
              connect: {
                slug: 'customerSlug',
              },
            },
          },
        ],
      },
    };

    await dialoguePrismaAdapter.create({ data: defaultTagsDialogueInput });

    const targetDialogueCreateInput: Prisma.DialogueCreateInput = {
      title: 'targetDialogue',
      slug: 'tagsTest',
      description: 'description',
      customer: {
        create: {
          name: 'TAGS_CUSTOMER',
          slug: 'customerTagsSlug',
        },
      },
      tags: {
        create: [
          {
            name: 'targetOne',
            customer: {
              connect: {
                slug: 'customerTagsSlug',
              },
            },
          },
          {
            name: 'targetTwo',
            customer: {
              connect: {
                slug: 'customerTagsSlug',
              },
            },
          },
          {
            name: 'targetThree',
            customer: {
              connect: {
                slug: 'customerTagsSlug',
              },
            },
          },
        ],
      },
    }

    const dialogue = await dialoguePrismaAdapter.create({ data: targetDialogueCreateInput });
    const tags = await dialoguePrismaAdapter.getTagsByDialogueId(dialogue.id);
    expect(tags).toHaveLength(3);
    const targetOneTag = tags.find((tag) => tag.name === 'targetOne');
    expect(targetOneTag).not.toBeUndefined();
  });

  test('Finds dialogue (with questions and edges) by dialogue ID', async () => {
    const defaultDialogueId = cuid();
    const dialogueCreateInputWithEdgesAndQuestions: Prisma.DialogueCreateInput = {
      ...defaultDialogueCreateInput,
      id: defaultDialogueId,
      questions: {
        create: {
          title: 'firstQuestion',
        },
      },
      edges: {
        create: {
          parentNode: {
            create: {
              title: 'parentQuestion',
              type: 'SLIDER',
              questionDialogue: {
                connect: {
                  id: defaultDialogueId,
                },
              },
            },
          },
          childNode: {
            create: {
              title: 'childQUestion',
              type: 'CHOICE',
              questionDialogue: {
                connect: {
                  id: defaultDialogueId,
                },
              },
            },
          },
        },
      },
    };

    await dialoguePrismaAdapter.create({ data: dialogueCreateInputWithEdgesAndQuestions });

    const edgesTestDialogueId = cuid();
    const edgeId = cuid();
    const edgesTestDialogueInput: Prisma.DialogueCreateInput = {
      id: edgesTestDialogueId,
      title: 'DEFAULT_DIALOGUE',
      slug: 'edgesTest',
      description: 'description',
      customer: {
        create: {
          name: 'EDGES_CUSTOMER',
          slug: 'customerEdgesSlug',
        },
      },
      questions: {
        create: {
          title: 'questionOne',
        },
      },
      edges: {
        create: [
          {
            id: edgeId,
            parentNode: {
              create: {
                title: 'parentNodeOne',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
            conditions: {
              create: {
                conditionType: 'TEXT_MATCH',
                matchValue: 'text',
              },
            },
            childNode: {
              create: {
                title: 'childNodeOne',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
          },
          {
            parentNode: {
              create: {
                title: 'parentNodeTwo',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
            childNode: {
              create: {
                title: 'childNodeTwo',
                questionDialogue: {
                  connect: {
                    id: edgesTestDialogueId,
                  },
                },
              },
            },
          },
        ],
      },
    }

    const dialogueWithEdges = await dialoguePrismaAdapter.create({ data: edgesTestDialogueInput });
    const templateDialogue = await dialoguePrismaAdapter.getTemplateDialogue(dialogueWithEdges.id);
    expect(templateDialogue?.questions).toHaveLength(5);
    expect(templateDialogue?.edges).toHaveLength(2);
  });
});
