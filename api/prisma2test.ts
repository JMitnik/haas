import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // wipe all content
  const QUESTION_ID = 'QUESTION_ID';
  const DIALOGUE_SLUG = 'DIALOGUE_SLUG';
  const WORKSPACE_SLUG = 'WORKSPACE_SLUG';

  await prisma.automation.deleteMany();
  await prisma.automationTrigger.deleteMany();
  await prisma.automationEvent.deleteMany();
  await prisma.automationCondition.deleteMany();
  await prisma.automationConditionMatchValue.deleteMany();


  await prisma.questionOfTrigger.deleteMany();
  await prisma.edge.deleteMany();
  await prisma.questionNode.deleteMany({
    where: {
      id: QUESTION_ID,
    }
  });
  await prisma.session.deleteMany();
  await prisma.dialogue.deleteMany({
    where: {
      slug: DIALOGUE_SLUG,
    }
  });
  await prisma.tag.deleteMany();
  // await prisma.userOfCustomer.deleteMany();
  await prisma.customer.deleteMany({
    where: {
      slug: WORKSPACE_SLUG,
    }
  });

  // ... you will write your Prisma Client queries here
  const workspace = await prisma.customer.create({
    data: {
      name: 'Workspace',
      slug: 'WORKSPACE_SLUG',
    }
  });

  const dialogue = await prisma.dialogue.create({
    data: {
      title: 'Dialogue',
      description: 'Desc',
      slug: DIALOGUE_SLUG,
      customer: {
        connect: {
          id: workspace.id,
        }
      }
    }
  })

  const targetQuestion = await prisma.questionNode.create({
    data: {
      id: QUESTION_ID,
      title: 'Slider question',
      type: 'SLIDER',
      questionDialogue: {
        connect: {
          id: dialogue.id,
        }
      }
    }
  })

  await prisma.automation.create({
    data: {
      label: 'First Trigger automation',
      type: 'TRIGGER',
      isActive: true,
      workspace: {
        connect: {
          id: workspace.id,
        }
      },
      automationTrigger: {
        create: {
          event: {
            create: {
              type: 'NEW_INTERACTION_QUESTION',
              question: {
                connect: {
                  id: targetQuestion.id,
                }
              }
            }
          },
          conditions: {
            create: [
              {
                question: {
                  connect: {
                    id: targetQuestion.id,
                  }
                },
                scope: 'QUESTION',
                operator: 'SMALLER_OR_EQUAL_THAN',
                questionScope: {
                  create: {
                    aspect: 'NODE_VALUE',
                    aggregate: {
                      create: {
                        type: 'AVG',
                        latest: 10,
                      }
                    }
                  }
                },
                matchValue: {
                  create: {
                    type: 'INT',
                    numberValue: 50,
                  }
                }
              },
              {
                dialogue: {
                  connect: {
                    id: dialogue.id,
                  }
                },
                scope: 'DIALOGUE',
                operator: 'GREATER_THAN',
                dialogueScope: {
                  create: {
                    aspect: 'NR_INTERACTIONS',
                    aggregate: {
                      create: {
                        type: 'COUNT',
                        latest: 10,
                      }
                    }
                  }
                },
                matchValue: {
                  create: {
                    type: 'INT',
                    numberValue: 10,
                  }
                }
              }
            ]
          },
          actions: {
            create: [
              { type: 'GENERATE_REPORT' },
              { type: 'SEND_EMAIL' },
            ]
          }
        }
      }
    }
  })
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    // await prisma.automation.deleteMany();
    // await prisma.automationTrigger.deleteMany();
    // await prisma.automationEvent.deleteMany();

    // await prisma.questionOfTrigger.deleteMany();
    // await prisma.edge.deleteMany();
    // await prisma.questionNode.deleteMany();
    // await prisma.session.deleteMany();
    // await prisma.dialogue.deleteMany();
    // await prisma.tag.deleteMany();
    // await prisma.userOfCustomer.deleteMany();
    // await prisma.customer.deleteMany();

    await prisma.$disconnect();
  });
