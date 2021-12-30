import { AutomationCondition as PrismaAutomationCondition, AutomationConditionBuilder, AutomationConditionBuilderType, NodeType, PrismaClient } from "@prisma/client"
import { AutomationCondition } from "./src/models/automations/AutomationTypes";

const prisma = new PrismaClient();

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
};

export const seedWorkspace = async (prisma: PrismaClient) => {
  const workspace = await prisma.customer.create({
    data: {
      id: 'BUILDER_WORKSPACE_ID',
      name: 'WORKSPACE',
      slug: 'BUILDER_WORKSPACE_SLUG',
      dialogues: {
        create: {
          id: 'BUILDER_DIALOGUE_ID',
          description: 'desc',
          slug: 'BUILDER_DIALOGUE_SLUG',
          title: 'DIALOGUE',
        }
      }
    },
    include: {
      dialogues: true,
    }
  });
  const sliderQuestion = await seedQuestion(prisma, 'BUILDER_DIALOGUE_ID', 'SLIDER', 'BUILDER_SLIDER_ID');
  // const choiceQuestion = await seedQuestion(prisma, 'BUILDER_DIALOGUE_ID', 'CHOICE');
  const dialogueId = workspace.dialogues?.[0]?.id
  return { workspace, sliderQuestion, dialogueId }
}

const main = async () => {
  await prisma.automationConditionBuilder.deleteMany({
    where: {
      id: {
        in: ['PARENT_BUILDER_ID', 'CHILD_BUILDER_ONE_ID', 'CHILD_BUILDER_ID_TWO']
      }
    }
  });
  await prisma.automationConditionMatchValue.deleteMany({
    where: {
      id: {
        in: ['BUILDER_MATCH_VALUE_ID', 'BUILDER_MATCH_VALUE_ID_TWO', 'BUILDER_MATCH_VALUE_ID_THREE', 'BUILDER_MATCH_VALUE_ID_FOUR']
      }
    },
  })

  await prisma.questionConditionScope.deleteMany({
    where: {
      id: {
        in: ['BUILDER_SCOPE_ID', 'BUILDER_SCOPE_ID_TWO', 'BUILDER_SCOPE_ID_THREE', 'BUILDER_SCOPE_ID_FOUR']
      }
    },
  });

  await prisma.automationCondition.deleteMany({
    where: {
      id: {
        in: ['BUILDER_CONDITION_ID', 'BUILDER_CONDITION_ID_TWO', 'BUILDER_CONDITION_ID_THREE', 'BUILDER_CONDITION_ID_FOUR']
      },
    }
  }),

    await prisma.questionNode.deleteMany({
      where: {
        id: 'BUILDER_SLIDER_ID',
      },
    });

  await prisma.dialogue.deleteMany({
    where: {
      id: 'BUILDER_DIALOGUE_ID',
    }
  })
  await prisma.customer.deleteMany({
    where: {
      id: 'BUILDER_WORKSPACE_ID',
    },
  });

  await prisma.conditionPropertyAggregate.deleteMany({
    where: {
      id: {
        in: ['BUILDER_AGGREGATE_ID', 'BUILDER_AGGREGATE_ID_TWO', 'BUILDER_AGGREGATE_ID_THREE', 'BUILDER_AGGREGATE_ID_FOUR'],
      }
    }
  })


  const { sliderQuestion, dialogueId } = await seedWorkspace(prisma);

  const builder = await prisma.automationConditionBuilder.create({
    data: {
      id: 'PARENT_BUILDER_ID',
      type: AutomationConditionBuilderType.AND,
      conditions: {
        create: {
          id: 'BUILDER_CONDITION_ID_TWO',
          scope: 'QUESTION',
          operator: 'SMALLER_OR_EQUAL_THAN',
          matchValues: {
            createMany: {
              data: [
                {
                  id: 'BUILDER_MATCH_VALUE_ID_TWO',
                  type: 'INT',
                  numberValue: 30,
                }
              ],
            },
          },
          question: {
            connect: {
              id: sliderQuestion.id,
            }
          },
          dialogue: dialogueId ? {
            connect: {
              id: dialogueId,
            },
          } : undefined,
          questionScope: {
            create: {
              id: 'BUILDER_SCOPE_ID_TWO',
              aggregate: {
                create: {
                  id: 'BUILDER_AGGREGATE_ID_TWO',
                  type: 'AVG',
                  latest: 1,
                },
              },
              aspect: 'NODE_VALUE',
            },
          },
        }
      },
      hasChildBuilder: {
        create: {
          id: 'CHILD_BUILDER_ONE_ID',
          type: AutomationConditionBuilderType.OR,
          conditions: {
            create: [
              {
                id: 'BUILDER_CONDITION_ID',
                scope: 'QUESTION',
                operator: 'SMALLER_OR_EQUAL_THAN',
                matchValues: {
                  createMany: {
                    data: [
                      {
                        id: 'BUILDER_MATCH_VALUE_ID',
                        type: 'INT',
                        numberValue: 50,
                      }
                    ],
                  },
                },
                question: {
                  connect: {
                    id: sliderQuestion.id,
                  }
                },
                dialogue: dialogueId ? {
                  connect: {
                    id: dialogueId,
                  },
                } : undefined,
                questionScope: {
                  create: {
                    id: 'BUILDER_SCOPE_ID',
                    aggregate: {
                      create: {
                        id: 'BUILDER_AGGREGATE_ID',
                        type: 'AVG',
                        latest: 1,
                      },
                    },
                    aspect: 'NODE_VALUE',
                  },
                },
              },
              {
                id: 'BUILDER_CONDITION_ID_THREE',
                scope: 'QUESTION',
                operator: 'SMALLER_OR_EQUAL_THAN',
                matchValues: {
                  createMany: {
                    data: [
                      {
                        id: 'BUILDER_MATCH_VALUE_ID_THREE',
                        type: 'INT',
                        numberValue: 50,
                      }
                    ],
                  },
                },
                question: {
                  connect: {
                    id: sliderQuestion.id,
                  }
                },
                dialogue: dialogueId ? {
                  connect: {
                    id: dialogueId,
                  },
                } : undefined,
                questionScope: {
                  create: {
                    id: 'BUILDER_SCOPE_ID_THREE',
                    aggregate: {
                      create: {
                        id: 'BUILDER_AGGREGATE_ID_THREE',
                        type: 'AVG',
                        latest: 1,
                      },
                    },
                    aspect: 'NODE_VALUE',
                  },
                },
              }
            ]
          },
          hasChildBuilder: {
            create: {
              id: 'CHILD_BUILDER_ID_TWO',
              type: 'AND',
              conditions: {
                create: {
                  id: 'BUILDER_CONDITION_ID_FOUR',
                  scope: 'QUESTION',
                  operator: 'SMALLER_OR_EQUAL_THAN',
                  matchValues: {
                    createMany: {
                      data: [
                        {
                          id: 'BUILDER_MATCH_VALUE_ID_FOUR',
                          type: 'INT',
                          numberValue: 50,
                        }
                      ],
                    },
                  },
                  question: {
                    connect: {
                      id: sliderQuestion.id,
                    }
                  },
                  dialogue: dialogueId ? {
                    connect: {
                      id: dialogueId,
                    },
                  } : undefined,
                  questionScope: {
                    create: {
                      id: 'BUILDER_SCOPE_ID_FOUR',
                      aggregate: {
                        create: {
                          id: 'BUILDER_AGGREGATE_ID_FOUR',
                          type: 'AVG',
                          latest: 1,
                        },
                      },
                      aspect: 'NODE_VALUE',
                    },
                  },
                },
              }

            }
          }
        }
      }
    }
  });

  const fetchedBuilder = await prisma.automationConditionBuilder.findUnique({
    where: {
      id: builder.id,
    },
    include: {
      conditions: true,
      hasChildBuilder: {
        // NOTE: This would only support one layer of depth. 
        // If we want multiple layers need to do a RAW_QUERY
        // see TODO: https://github.com/prisma/prisma/discussions/10406
        include: {
          conditions: true,
          hasChildBuilder: {
            include: {
              conditions: true,
              hasChildBuilder: {
                include: {
                  conditions: true,
                }
              }
            }
          },
        }
      },
    }
  });

  let destructed = {};
  const destructedData = destruct(destructed, fetchedBuilder as any)

  console.log(fetchedBuilder)
  console.log('Destructed data: ', destructedData);
  console.log('length AND', destructedData.AND.length);
  console.log('child OR length: ', destructedData.AND[1].OR[2]);
}

interface BuilderEntry extends AutomationConditionBuilder {
  type: AutomationConditionBuilderType;
  conditions: PrismaAutomationCondition[];
  hasChildBuilder: BuilderEntry;
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

interface DestructedBuilderEntry {
  OR?: XOR<DestructedBuilderEntry[], PrismaAutomationCondition[]>
  AND?: XOR<DestructedBuilderEntry[], PrismaAutomationCondition[]>
}

const test: DestructedBuilderEntry = {
  AND: [
    {
      createdAt: new Date(Date.now()),
      updatedAt: null,
      scope: 'DIALOGUE',
      operator: 'SMALLER_OR_EQUAL_THAN',
      questionId: null,
      dialogueId: null,
      automationTriggerId: null,
      automationConditionBuilderId: null
    },
    {
      OR: [
        {
          id: '',
          createdAt: new Date(Date.now()),
          updatedAt: null,
          scope: 'DIALOGUE',
          operator: 'SMALLER_OR_EQUAL_THAN',
          questionId: null,
          dialogueId: null,
          automationTriggerId: null,
          automationConditionBuilderId: null
        },
        {
          id: '',
          createdAt: new Date(Date.now()),
          updatedAt: null,
          scope: 'DIALOGUE',
          operator: 'SMALLER_OR_EQUAL_THAN',
          questionId: null,
          dialogueId: null,
          automationTriggerId: null,
          automationConditionBuilderId: null
        },
      ]
    }
  ]
}

const destruct = (dataObj: any, entry: BuilderEntry) => {

  if (entry.conditions.length) {
    dataObj[entry.type] = [
      ...entry.conditions,
    ]
  }

  if (entry.hasChildBuilder) {
    const child = entry.hasChildBuilder;
    const operatorObject = {}
    const des = destruct(operatorObject, child);
    dataObj[entry.type].push(des)
  }

  return dataObj;
}

main().finally(async () => {
  await prisma?.$disconnect();
})