import { AutomationCondition as PrismaAutomationCondition, AutomationConditionBuilder, AutomationConditionBuilderType, NodeType, PrismaClient } from "@prisma/client"
import AutomationService from "./src/models/automations/AutomationService";
import { AutomationCondition } from "./src/models/automations/AutomationTypes";

const prisma = new PrismaClient();
const automationService = new AutomationService(prisma);

interface BuilderEntry extends AutomationConditionBuilder {
  type: AutomationConditionBuilderType;
  conditions: PrismaAutomationCondition[];
  hasChildBuilder?: BuilderEntry;
}

interface PreValidatedConditions {
  AND?: (AutomationCondition | PreValidatedConditions)[];
  OR?: (AutomationCondition | PreValidatedConditions)[];
}

interface CheckedConditions {
  AND?: (boolean | CheckedConditions)[];
  OR?: (boolean | CheckedConditions)[];
}

const validateConditions = async (data: PreValidatedConditions, checkedObject: CheckedConditions) => {
  const isAND = !!data['AND'];

  await Promise.all(data[isAND ? 'AND' : 'OR'].map(async (entry) => {
    const type = isAND ? 'AND' : 'OR'
    if (entry['id']) {
      const validated = await automationService.validateQuestionScopeCondition(entry as AutomationCondition);

      const hasAndorOr = Object.keys(checkedObject).find((property) => property === 'AND' || property === 'OR');

      if (!hasAndorOr) {
        console.log('Type: ', type);
        checkedObject[type] = []
      }
      checkedObject[hasAndorOr || type].push(validated);
    }

    if (entry['AND'] || entry['OR']) {
      checkedObject[type] = [];
      const childIsAnd = entry['AND'] ? { AND: [] } : { OR: [] };
      const validated = await validateConditions(entry as PreValidatedConditions, childIsAnd);
      checkedObject[type].push(validated);
    }
  }));

  return checkedObject;
}

const checkConditions = (example: CheckedConditions, summarizedList = [], depth: number) => {
  const isAND = !!example['AND']
  depth++;

  example[isAND ? 'AND' : 'OR'].forEach((entry) => {
    if (typeof entry === 'boolean') {
      summarizedList.push(entry);
    }

    if (typeof entry === 'object') {
      if (entry['AND']) {
        const areAllTrueValues = entry.AND.every((andEntry) => {
          if (typeof andEntry === 'object') {
            return checkConditions(andEntry, [], depth);
          }
          return andEntry === true;
        });
        summarizedList.push(areAllTrueValues);
      }

      if (entry['OR']) {
        const someTrueValues = entry.OR.some((orEntry) => {
          if (typeof orEntry === 'object') {
            return checkConditions(orEntry, [], depth)
          }
          return orEntry === true;
        });
        summarizedList.push(someTrueValues);
      }

    }
  });

  const allConditionsPassed = isAND ? summarizedList.every((entry) => entry) : summarizedList.some((entry) => entry);
  return allConditionsPassed;
}

const destruct = async (dataObj: any, entry: BuilderEntry) => {
  if (entry.conditions.length) {
    dataObj[entry.type] = [
      ...entry.conditions,
    ]
  }

  if (entry.childConditionBuilderId) {
    const child = await automationService.findAutomationConditionBuilder(entry.childConditionBuilderId);
    console.log('child: ', child);
    const operatorObject = {}
    const des = await destruct(operatorObject, child);
    dataObj[entry.type].push(des)
  }

  return dataObj;
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
  await prisma.automationConditionOperand.deleteMany({
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
  });

  await prisma.sliderNodeEntry.deleteMany({
    where: {
      id: {
        in: [1337],
      }
    }
  }),

    await prisma.nodeEntry.deleteMany({
      where: {
        id: {
          in: ['SESSION_SLIDER_ENTRY'],
        }
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
        create: [
          {
            id: 'BUILDER_CONDITION_ID',
            scope: 'QUESTION',
            operator: 'SMALLER_OR_EQUAL_THAN',
            operands: {
              createMany: {
                data: [
                  {
                    id: 'BUILDER_MATCH_VALUE_ID',
                    type: 'INT',
                    numberValue: 20,
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
        ]
      },
      hasChildBuilder: {
        create: {
          id: 'CHILD_BUILDER_ONE_ID',
          type: AutomationConditionBuilderType.OR,
          conditions: {
            create: [
              {
                id: 'BUILDER_CONDITION_ID_TWO',
                scope: 'QUESTION',
                operator: 'SMALLER_OR_EQUAL_THAN',
                operands: {
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
              },
              {
                id: 'BUILDER_CONDITION_ID_THREE',
                scope: 'QUESTION',
                operator: 'SMALLER_OR_EQUAL_THAN',
                operands: {
                  createMany: {
                    data: [
                      {
                        id: 'BUILDER_MATCH_VALUE_ID_THREE',
                        type: 'INT',
                        numberValue: 1,
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
              },
            ]
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
      conditions: {
        include: {
          questionScope: {
            include: {
              aggregate: true,
            },
          },
          dialogueScope: {
            include: {
              aggregate: true,
            },
          },
          operands: true,
          workspaceScope: {
            include: {
              aggregate: true,
            },
          },
          dialogue: true,
          question: true,
        }
      },
    }
  });

  await prisma.nodeEntry.create({
    data: {
      id: 'SESSION_SLIDER_ENTRY',
      relatedNode: {
        connect: {
          id: sliderQuestion.id,
        },
      },
      sliderNodeEntry: {
        create: {
          id: 1337,
          value: 5,
        }
      }
    }
  })


  let destructed = {};
  const destructedData = await destruct(destructed, fetchedBuilder)
  console.log('Destructed data: ', destructedData);
  const validatedObjects = await validateConditions(destructedData, {});
  console.log('Validated Objects: ', validatedObjects);

  const builderConditionsPassed = checkConditions(validatedObjects, [], 0);
  console.log('Builder condition passed: ', builderConditionsPassed)
}

main().finally(async () => {
  await prisma?.$disconnect();
})