import {
  AutomationCondition, AutomationConditionBuilderType, AutomationConditionScopeType, DialogueConditionScope,
  Prisma, PrismaClient, QuestionAspect, QuestionConditionScope,
  WorkspaceConditionScope,
} from '@prisma/client';
import { cloneDeep, countBy } from 'lodash';
import { isPresent } from 'ts-is-present';
import { NexusGenInputs } from '../../generated/nexus';

import {
  UpdateAutomationConditionInput, UpdateAutomationInput,
  CreateAutomationInput, CreateScopeDataInput, CreateAutomationConditionScopeInput,
  CreateAutomationConditionInput, ConditionPropertAggregateInput, CreateConditionBuilderInput, UpdateConditionBuilderInput,
} from './AutomationTypes';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findAutomationConditionBuilderById = (builderId: string) => {
    return this.prisma.automationConditionBuilder.findUnique({
      where: {
        id: builderId,
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
        }
      }
    })
  };

  findAutomationConditionById = (automationConditionId: string) => {
    return this.prisma.automationCondition.findUnique({
      where: {
        id: automationConditionId,
      },
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
      },
    })
  }

  aggregateScopedSliderNodeEntries = async (
    questionId: string,
    aspect: QuestionAspect,
    aggregate?: ConditionPropertAggregateInput | null
  ) => {
    const totalAmountSliderValues = await this.prisma.sliderNodeEntry.count({
      where: {
        nodeEntry: {
          relatedNodeId: questionId,
          creationDate: {
            lte: aggregate?.endDate || undefined,
            gte: aggregate?.startDate || undefined,
          },
        },
      },
    })

    const aggregatedSliderValues = await this.prisma.sliderNodeEntry.aggregate({
      where: {
        nodeEntry: {
          relatedNodeId: questionId,
          creationDate: {
            lte: aggregate?.endDate || undefined,
            gte: aggregate?.startDate || undefined,
          },
        },
      },
      orderBy: {
        nodeEntry: {
          creationDate: 'desc',
        },
      },
      // TODO: Change average value based aspect when we introduce new information such as slider speed
      _avg: aggregate?.type === 'AVG' ? {
        value: true,
      } : undefined,
      take: aggregate?.latest || undefined,
    });

    return { totalEntries: totalAmountSliderValues, aggregatedValues: aggregatedSliderValues };
  };

  aggregateScopedChoiceNodeEntries = async (
    questionId: string,
    aspect: QuestionAspect,
    aggregate?: ConditionPropertAggregateInput | null
  ) => {
    const totalAmountChoiceValues = await this.prisma.choiceNodeEntry.count({
      where: {
        nodeEntry: {
          relatedNodeId: questionId,
          creationDate: {
            lte: aggregate?.endDate || undefined,
            gte: aggregate?.startDate || undefined,
          },
        },
      },
    });

    const aggregatedChoices = await this.prisma.choiceNodeEntry.findMany({
      where: {
        nodeEntry: {
          relatedNodeId: questionId,
          creationDate: {
            lte: aggregate?.endDate || undefined,
            gte: aggregate?.startDate || undefined,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: aggregate?.latest || undefined,
    });

    const countedChoices = countBy(aggregatedChoices, (choice) => choice.value);

    return { totalEntries: totalAmountChoiceValues, aggregatedValues: countedChoices };
  }

  /**
   * Checks whether any automation events exist where either a dialogue id or one of the question Ids belongs to.
   * @param dialogueId the dialogue ID part potentially part of an AutomationEvent
   * @param questionIds a list of question IDs potentially part of an AutomationEvent
   * @returns a list of Automations
   */
  findTriggerAutomationsById = (triggerAutomationIds: string[]) => {
    // TODO: Introduce system-wide fetch
    return this.prisma.automationTrigger.findMany({
      where: {
        id: {
          in: triggerAutomationIds,
        },
      },
      include: {
        event: {
          include: {
            question: {
              include: {
                questionDialogue: true,
              },
            },
            dialogue: true,
          },
        },
        conditionBuilder: {
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
              },
            },
          }
        },
        actions: true,
      },
    })
  }

  /**
   * Checks whether any automation events exist where either a dialogue id or one of the question Ids belongs to.
   * @param dialogueId the dialogue ID part potentially part of an AutomationEvent
   * @param questionIds a list of question IDs potentially part of an AutomationEvent
   * @returns a list of Automations
   */
  findCandidateAutomations = (dialogueId: string, questionIds: Array<string>) => {
    // TODO: Introduce system-wide fetch
    return this.prisma.automation.findMany({
      where: {
        AND: [
          {
            type: 'TRIGGER',
          },
          {
            automationTrigger: {
              OR: [
                {
                  event: {
                    OR: [
                      {
                        dialogueId,
                      },
                      {
                        questionId: {
                          in: questionIds,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        workspace: true,
        automationTrigger: {
          include: {
            event: {
              include: {
                question: {
                  include: {
                    questionDialogue: true,
                  },
                },
                dialogue: true,
              },
            },
            conditionBuilder: {
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
                  },
                }
              }
            },
            actions: true,
          },
        },
      },
    })
  }

  /**
* Build a userConnection prisma query based on the filter parameters.
* @param customerSlug the slug of a workspace
* @param filter a filter containing information in regard to used search queries, date ranges and order based on column
*/
  buildFindAutomationsQuery = (workspaceSlug: string, filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null): Prisma.AutomationWhereInput => {
    let automationWhereInput: Prisma.AutomationWhereInput = {
      workspace: {
        slug: workspaceSlug,
      },
    }

    if (filter?.search) {
      automationWhereInput = {
        ...cloneDeep(automationWhereInput),
        OR: [
          { label: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }
    }

    if (filter?.type) {
      automationWhereInput.type = { equals: filter.type }
    }

    return automationWhereInput;
  }

  countAutomations = async (workspaceSlug: string, filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null) => {
    const totalAutomations = await this.prisma.automation.count({
      where: this.buildFindAutomationsQuery(workspaceSlug, filter),
    });
    return totalAutomations;
  }

  /**
  * Order userOfCustomer by UserConnectionFilterInput
  * @param filter
  */
  buildOrderByQuery = (filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.AutomationOrderByWithRelationInput[] = [];

    if (filter?.orderBy?.by === 'type') {
      orderByQuery.push({
        type: filter.orderBy.desc ? 'desc' : 'asc',
      });
    }

    if (filter?.orderBy?.by === 'updatedAt') {
      orderByQuery.push({
        updatedAt: filter.orderBy.desc ? 'desc' : 'asc',
      });
    }

    return orderByQuery;
  };

  findPaginatedAutomations = async (workspaceSlug: string, filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const automations = await this.prisma.automation.findMany({
      where: this.buildFindAutomationsQuery(workspaceSlug, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
    });

    return automations;
  }

  /**
   * Finds an automation (and its relationships) by the provided ID
   * @param automationId the ID of the automation
   * @returns an Automation with relationships included or null if no automation with specified ID exist in the database
   */
  findAutomationById = async (automationId: string) => {
    const automation = await this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        workspace: true,
        automationTrigger: {
          include: {
            event: {
              include: {
                question: true,
                dialogue: true,
              },
            },
            conditionBuilder: {
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
                  },
                }
              }
            },
            actions: true,
          },
        },
      },
    });
    return automation;
  }

  /**
   * Creates a Prisma-ready data object for creation of an AutomationConditionScope
   * @param scope a generic scope object containing the scope and either question, dialogue or workspace scope
   * @returns a Prisma-ready data object for creation of an AutomationConditionScope
   */
  constructCreateAutomationConditionScopeData = (
    scope: CreateAutomationConditionScopeInput
  ): CreateScopeDataInput | undefined => {
    if (scope.type === 'QUESTION' && scope.questionScope) {
      return {
        aspect: scope.questionScope.aspect,
        aggregate: {
          type: scope.questionScope.aggregate.type,
          startDate: scope.questionScope.aggregate.startDate,
          endDate: scope.questionScope.aggregate.endDate,
          latest: scope.questionScope.aggregate.latest,
        },
      };
    };

    if (scope.type === 'DIALOGUE' && scope.dialogueScope) {
      return {
        aspect: scope.dialogueScope.aspect,
        aggregate: {
          type: scope.dialogueScope.aggregate.type,
          startDate: scope.dialogueScope.aggregate.startDate,
          endDate: scope.dialogueScope.aggregate.endDate,
          latest: scope.dialogueScope.aggregate.latest,
        },
      }
    }

    if (scope.type === 'WORKSPACE' && scope.workspaceScope) {
      return {
        aspect: scope.workspaceScope.aspect,
        aggregate: {
          type: scope.workspaceScope.aggregate.type,
          startDate: scope.workspaceScope.aggregate.startDate,
          endDate: scope.workspaceScope.aggregate.endDate,
          latest: scope.workspaceScope.aggregate.latest,
        },
      }
    }

    return undefined;
  }

  /**
   *
   * @param dbCondition the current condition in the database matching id of input condition
   * @param condition the input condition
   * @param checkAgainstScope the current scope that this function is called for and being checked against.
   * @returns either a prisma delete object or undefined depending on whether a previous scope exists
   */
  constructUpdateRemovalScope = (
    dbCondition: (AutomationCondition & {
      questionScope: QuestionConditionScope | null;
      dialogueScope: DialogueConditionScope | null;
      workspaceScope: WorkspaceConditionScope | null;
    }) | null,
    condition: UpdateAutomationConditionInput,
    checkAgainstScope: AutomationConditionScopeType): { delete: boolean } | undefined => {
    if (dbCondition?.dialogueScope?.id && checkAgainstScope === 'DIALOGUE' && condition.scope.type !== 'DIALOGUE') {
      return { delete: true };
    }

    if (dbCondition?.questionScope?.id && checkAgainstScope === 'QUESTION' && condition.scope.type !== 'QUESTION') {
      return { delete: true };
    }

    if (dbCondition?.workspaceScope?.id && checkAgainstScope === 'WORKSPACE' && condition.scope.type !== 'WORKSPACE') {
      return { delete: true };
    }

    return undefined;
  }

  /**
   * Creates a Prisma-ready data object for UPDATE of an AutomationCondition
   * @param condition an input object containing information for updating an AutomationCondition
   * @returns a Prisma-ready data object for updating of an AutomationCondition
   */
  constructUpdateAutomationConditionData = async (
    condition: UpdateAutomationConditionInput
  ): Promise<Prisma.AutomationConditionUpdateWithoutAutomationConditionBuilderInput> => {
    const { dialogueId, scope, questionId, operands, operator } = condition;
    const operandIds = operands.map((operand) => operand.id).filter(isPresent);
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    const dbCondition = condition.id ? await this.prisma.automationCondition.findUnique(({
      where: {
        id: condition.id,
      },
      include: {
        questionScope: true,
        dialogueScope: true,
        workspaceScope: true,
      },
    })) : null;

    return {
      scope: scope.type,
      operator,
      operands: {
        deleteMany: {
          id: {
            notIn: operandIds,
          },
        },

        upsert: operands.map((operand) => {
          console.log('OPERAND ID: ', operand.id);
          return {
            where: {
              id: operand?.id || '-1',
            },
            create: {
              type: operand.type,
              textValue: operand.textValue,
              dateTimeValue: operand.dateTimeValue,
              numberValue: operand.numberValue,
            },
            update: {
              type: operand.type,
              textValue: operand.textValue,
              dateTimeValue: operand.dateTimeValue,
              numberValue: operand.numberValue,
            },
          }
        }),
      },
      question: questionId ? {
        connect: {
          id: questionId,
        },
      } : { disconnect: true },
      dialogue: dialogueId ? {
        connect: {
          id: dialogueId,
        },
      } : { disconnect: true },
      questionScope: (scope.type === 'QUESTION' && mappedScope) ? {
        upsert: {
          create: {
            aggregate: {
              create: mappedScope.aggregate,
            },
            aspect: mappedScope.aspect,
          },
          update: {
            aggregate: {
              update: mappedScope.aggregate,
            },
            aspect: mappedScope.aspect,
          },
        },
      } : this.constructUpdateRemovalScope(dbCondition, condition, 'QUESTION'),
      dialogueScope: (scope.type === 'DIALOGUE' && mappedScope) ? {
        upsert: {
          create: {
            aggregate: {
              create: mappedScope.aggregate,
            },
            aspect: mappedScope.aspect,
          },
          update: {
            aggregate: {
              update: mappedScope.aggregate,
            },
            aspect: mappedScope.aspect,
          },
        },
      } : this.constructUpdateRemovalScope(dbCondition, condition, 'DIALOGUE'),
      workspaceScope: (scope.type === 'WORKSPACE' && mappedScope) ? {
        upsert: {
          create: {
            aggregate: {
              create: mappedScope.aggregate,
            },
            aspect: mappedScope.aspect,
          },
          update: {
            aggregate: {
              update: mappedScope.aggregate,
            },
            aspect: mappedScope.aspect,
          },
        },
      } : this.constructUpdateRemovalScope(dbCondition, condition, 'WORKSPACE'),
    }
  }

  /**
   * Creates a Prisma-ready data object for CREATE of an AutomationCondition
   * @param condition an input object containing information for creating an AutomationCondition
   * @returns a Prisma-ready data object for creating of an AutomationCondition
   */
  constructCreateAutomationConditionData = (
    condition: CreateAutomationConditionInput
  ): Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput |
    Prisma.Enumerable<Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput> |
    Prisma.AutomationConditionCreateManyAutomationConditionBuilderInput |
    Prisma.Enumerable<Prisma.AutomationConditionCreateManyAutomationConditionBuilderInput> => {
    const { dialogueId, scope, questionId, operands, operator } = condition;
    // TODO: Introduce workspace-wide condition
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    return {
      scope: scope.type,
      operator,
      operands: {
        createMany: {
          data: operands.map((operand) =>
          (
            {
              type: operand.type,
              textValue: operand.textValue,
              dateTimeValue: operand.dateTimeValue,
              numberValue: operand.numberValue,
            }
          )),
        },
      },
      question: questionId ? {
        connect: {
          id: questionId,
        },
      } : undefined,
      dialogue: dialogueId ? {
        connect: {
          id: dialogueId,
        },
      } : undefined,
      questionScope: (scope.type === 'QUESTION' && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        },
      } : undefined,
      dialogueScope: (scope.type === 'DIALOGUE' && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        },
      } : undefined,
      workspaceScope: (scope.type === 'WORKSPACE' && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        },
      } : undefined,
    };
  }

  constructCreateConditionBuilderData = (input: CreateConditionBuilderInput): Prisma.AutomationConditionBuilderCreateInput => {
    let childBuilder;

    if (input.childBuilder) {
      childBuilder = this.constructCreateConditionBuilderData(input.childBuilder);
    }

    return {
      type: input.type,
      conditions: {
        create: input.conditions?.map((condition) => this.constructCreateAutomationConditionData(condition)) as Prisma.Enumerable<Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput>
      },
      childConditionBuilder: {
        create: childBuilder,
      },
    }
  }

  /**
   * Creates a prisma-ready data object for creation of an AutomationTrigger
   * @param input an object containing all information necessary to create an AutomationTrigger
   * @returns a Prisma-ready data object for creation of an AutomationTrigger
   */
  buildCreateAutomationTriggerData = (
    input: CreateAutomationInput
  ): Prisma.AutomationTriggerCreateWithoutAutomationsInput => {
    const { event, actions, conditions, conditionBuilder } = input;

    return {
      event: {
        create: {
          type: event.eventType || null,
          dialogue: event.dialogueId ? {
            connect: {
              id: event.dialogueId,
            },
          } : undefined,
          question: event.questionId ? {
            connect: {
              id: event.questionId,
            },
          } : undefined,
        },
      },
      conditionBuilder: {
        create: this.constructCreateConditionBuilderData(conditionBuilder),
      },
      actions: {
        create: actions.map((action) => {
          return {
            type: action.type,
            apiKey: action.apiKey,
            endpoint: action.endpoint,
            payload: action.payload,
          }
        }),
      },
    }
  }

  buildSingle = (conditionBuilder: UpdateConditionBuilderInput, parentConditionBuilderId: string) => {
    // If builder has no ID => new builder 
    // ===> Has to connect this new builder to 
    // ===> If there is a child builder that one is also new and can just use prisma create/createMany properties

  }

  buildUpdateAutomationConditionBuilderData = async (conditionBuilder: UpdateConditionBuilderInput, isRoot = true): Promise<Prisma.AutomationConditionBuilderUpdateWithoutAutomationTriggerInput | Prisma.AutomationConditionBuilderCreateWithoutParentConditionBuilderInput> => {
    let childConditionBuilder;
    const isExistingBuilder = (isRoot || !!conditionBuilder.id)

    const inputConditionIds = conditionBuilder.conditions.map((condition) => condition.id).filter(isPresent);
    const upsertConditions: Prisma.Enumerable<Prisma.AutomationConditionUpsertWithWhereUniqueWithoutAutomationConditionBuilderInput>
      = await Promise.all(conditionBuilder.conditions.map(async (condition) => {
        return {
          where: {
            id: condition?.id || '-1',
          },
          create: this.constructCreateAutomationConditionData(condition) as Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput,
          update: await this.constructUpdateAutomationConditionData(condition),
        }
      }));

    const createConditions = conditionBuilder.conditions.map((condition) => {
      return this.constructCreateAutomationConditionData(condition)
    }) as Prisma.Enumerable<Prisma.AutomationConditionCreateManyAutomationConditionBuilderInput>;

    if (conditionBuilder.childBuilder) {
      const childBuilder = await this.buildUpdateAutomationConditionBuilderData(conditionBuilder.childBuilder, false);
      childConditionBuilder = childBuilder;
    }

    // Delete ALL which are not in inputConditionIds is definitely not the way wtf daan 🙈
    await this.prisma.questionConditionScope.deleteMany({
      where: {
        automationConditionId: {
          notIn: inputConditionIds,
        },
      },
    });

    // Delete ALL which are not in inputConditionIds is definitely not the way wtf daan 🙈
    await this.prisma.automationConditionOperand.deleteMany({
      where: {
        automationConditionId: {
          notIn: inputConditionIds,
        },
      },
    });

    let conditionStructure: Prisma.AutomationConditionUpdateManyWithoutAutomationConditionBuilderInput | Prisma.AutomationConditionCreateNestedManyWithoutAutomationConditionBuilderInput;

    if (isExistingBuilder) {
      conditionStructure = {
        deleteMany: {
          id: {
            notIn: inputConditionIds,
          },
        },
        upsert: upsertConditions,

      }
    } else {
      conditionStructure = {
        create: createConditions,
      }
    }

    return {
      type: conditionBuilder.type,
      conditions: conditionStructure,
      childConditionBuilder: childConditionBuilder ? {
        // TODO: The create of a childConditionBuilder is different than the root.
        // Since it is guaranteed childBuilder didn't exist there is no upsert option as shown in 791
        // therefor need adjust recursive function

        create: !childConditionBuilder.id ? childConditionBuilder as Prisma.AutomationConditionBuilderCreateWithoutAutomationTriggerInput : undefined,
        update: childConditionBuilder.id ? childConditionBuilder : undefined,

      } : undefined,
    }
  };
  async buildUpdateAutomationTriggerData(
    input: UpdateAutomationInput
  ): Promise<Prisma.AutomationTriggerUpdateInput> {
    const { event, actions: inputActions, conditionBuilder } = input;

    const inputActionIds = inputActions.map((action) => action.id).filter(isPresent);
    const updateConditionBuilderData = await this.buildUpdateAutomationConditionBuilderData(conditionBuilder);
    console.dir(updateConditionBuilderData, { depth: null });

    return {
      conditionBuilder: {
        update: updateConditionBuilderData,
      },
      event: {
        update: {
          type: event.eventType,
          dialogue: event.dialogueId ? {
            connect: {
              id: event.dialogueId,
            },
          } : { disconnect: true },
          question: event.questionId ? {
            connect: {
              id: event.questionId,
            },
          } : { disconnect: true },
        },
      },
      actions: {
        deleteMany: {
          id: {
            notIn: inputActionIds,
          },
        },
        upsert: inputActions.map((action) => {
          return {
            where: {
              id: action?.id || '-1',
            },
            create: {
              type: action.type,
              apiKey: action?.apiKey,
              endpoint: action?.endpoint,
              payload: action?.payload,
            },
            update: {
              type: action.type,
              apiKey: action?.apiKey,
              endpoint: action?.endpoint,
              payload: action?.payload,
            },
          };
        }),
      }
    }
  }

  /**
   * Updates an automation based on provided input
   * @param input an object containing all information necessary to update an automation
   * @returns an updated Automation
   */
  updateAutomation = async (input: UpdateAutomationInput) => {
    const { description, label, automationType } = input;
    const automation = await this.findAutomationById(input.id);
    const automationTriggerUpdateArgs = await this.buildUpdateAutomationTriggerData(input);

    return this.prisma.automation.update({
      where: {
        id: input.id,
      },
      data: {
        label: label,
        type: automationType,
        description,
        // TODO: Upgrade this when campaignAutomation is introduced (delete other automation entry on swap)
        automationTrigger: automation ? {
          update: automationTriggerUpdateArgs,
        } : undefined,
      },
    });
  }

  /**
   * Creates an automation based on provided input
   * @param input n object containing all information necessary to create an automation
   * @returns an created Automation
   */
  createAutomation = async (input: CreateAutomationInput) => {
    const { description, workspaceId, label, automationType } = input;
    return this.prisma.automation.create({
      data: {
        label: label,
        type: automationType,
        description,
        automationTrigger: {
          create: this.buildCreateAutomationTriggerData(input),
        },
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });
  };

  /**
   * Finds the workspace an automation is part of by the provided automation ID
   * @param automationId the id of an automation
   * @returns a workspace
   */
  findWorkspaceByAutomationId = async (automationId: string) => {
    const automation = await this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        workspace: true,
      },
    });
    return automation?.workspace || null;
  }

  /**
   * Finds all automations part of a workspace
   * @param workspaceId a workspace ID
   * @returns a list of automations part of a workspace
   */
  findAutomationsByWorkspaceId = async (workspaceId: string) => {
    const workspace = await this.prisma.customer.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        automations: true,
      },
    });

    return workspace?.automations || [];
  };
}
