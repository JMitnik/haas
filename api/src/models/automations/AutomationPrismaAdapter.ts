import {
  AutomationCondition, AutomationConditionScopeType, AutomationType,
  ConditionPropertyAggregateType, DialogueConditionScope,
  Prisma, PrismaClient, QuestionAspect, QuestionConditionScope,
  WorkspaceConditionScope,
} from '@prisma/client';
import { cloneDeep, countBy } from 'lodash';
import { isPresent } from 'ts-is-present';
import { NexusGenInputs } from '../../generated/nexus';

import {
  UpdateAutomationConditionInput, UpdateAutomationInput,
  CreateAutomationInput, CreateScopeDataInput, CreateAutomationConditionScopeInput,
  CreateAutomationConditionInput, ConditionPropertAggregateInput, CreateConditionBuilderInput,
  UpdateConditionBuilderInput,
} from './AutomationTypes';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findScheduledAutomationById = async (automationScheduledId: string) => {
    const automationScheduled = await this.prisma.automationScheduled.findUnique({
      where: {
        id: automationScheduledId,
      },
      include: {
        actions: true,
      },
    });
    return automationScheduled;
  };

  deleteAutomation = async (input: NexusGenInputs['DeleteAutomationInput']) => {
    const automation = await this.prisma.automation.delete({
      where: {
        id: input.automationId,
      },
    });

    if (automation.automationScheduledId) {
      await this.prisma.automationScheduled.delete({
        where: {
          id: automation.automationScheduledId,
        },
      });

      await this.prisma.automationAction.deleteMany({
        where: {
          automationTriggers: {
            some: {
              id: automation.automationScheduledId,
            },
          },
        },
      });
    }

    if (automation?.automationTriggerId) {
      const automationTrigger = await this.prisma.automationTrigger.delete({
        where: {
          id: automation.automationTriggerId,
        },
        include: {
          conditionBuilder: {
            include: {
              conditions: true,
              childConditionBuilder: {
                include: {
                  conditions: true,
                },
              },
            },
          },
        },
      });

      const builderConditionIds = automationTrigger.conditionBuilder.conditions.map((condition) => condition.id);
      const childBuilderConditionIds = automationTrigger.conditionBuilder.childConditionBuilder?.conditions.map(
        (condition) => condition.id) || []

      const conditionIds = [...builderConditionIds, ...childBuilderConditionIds]
      const builderIds = [automationTrigger.conditionBuilder.id]

      if (automationTrigger.conditionBuilder.childConditionBuilder?.id) {
        builderIds.push(automationTrigger.conditionBuilder.childConditionBuilder?.id);
      };

      await this.prisma.automationEvent.deleteMany({
        where: {
          automationTrigger: {
            some: {
              id: automationTrigger.id,
            },
          },
        },
      });

      await this.prisma.automationConditionOperand.deleteMany({
        where: {
          automationConditionId: {
            in: conditionIds,
          },
        },
      });

      await this.prisma.dialogueConditionScope.deleteMany({
        where: {
          automationConditionId: {
            in: conditionIds,
          },
        },
      });

      await this.prisma.questionConditionScope.deleteMany({
        where: {
          automationConditionId: {
            in: conditionIds,
          },
        },
      })

      await this.prisma.workspaceConditionScope.deleteMany({
        where: {
          automationConditionId: {
            in: conditionIds,
          },
        },
      });

      await this.prisma.automationCondition.deleteMany({
        where: {
          automationConditionBuilderId: {
            in: builderIds,
          },
        },
      });

      await this.prisma.automationConditionBuilder.deleteMany({
        where: {
          id: {
            in: builderIds,
          },
        },
      });

      await this.prisma.automationAction.deleteMany({
        where: {
          automationTriggers: {
            some: {
              id: automationTrigger.id,
            },
          },
        },
      });
    }

    return automation;
  }

  /**
   * Finds an AutomationConditionBuilder by its ID
   * @param builderId id of a condition builder
   * @returns an AutomationConditionBuilder including its conditions
   */
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
          },
        },
      },
    })
  };

  /**
   * Finds an AutomationCondition by its ID
   * @param automationConditionId the ID of an AutomationCondition
   * @returns An AutomationCondition including its relations
   */
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

  /**
   * Calculates aggregated an value of slider node entries based on aspect and aggregate params
   * @param questionId The ID of the pertaining slider node question
   * @param aspect An question aspect to aggregate on
   * @param aggregate An object containing aggregate specifications such as type as well as data boundaries
   * @returns An object containing total amount of entries within aggregate boundaries as well as an aggregated value
   */
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
      _avg: aggregate?.type === ConditionPropertyAggregateType.AVG ? {
        value: true,
      } : undefined,
      take: aggregate?.latest || undefined,
    });

    return { totalEntries: totalAmountSliderValues, aggregatedValues: aggregatedSliderValues };
  };

  /**
   * Calculates aggregated an value of choice node entries based on aspect and aggregate params
   * @param questionId The ID of the pertaining choice node question
   * @param aspect An question aspect to aggregate on
   * @param aggregate An object containing aggregate specifications such as type as well as data boundaries
   * @returns An object containing total amount of entries within aggregate boundaries as well as an aggregated value
   */
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
          },
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
            type: AutomationType.TRIGGER,
            isActive: true, // Only active automations should be checked
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
                },
              },
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

  /**
   * Counts the amount of automation within specific filter boundaries
   * @param workspaceSlug the slug of a workspace
   * @param filter an filter object to determine boundaries to look within
   * @returns The amount of automations within a specific set of filter boundaries
   */
  countAutomations = async (workspaceSlug: string, filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null) => {
    const totalAutomations = await this.prisma.automation.count({
      where: this.buildFindAutomationsQuery(workspaceSlug, filter),
    });
    return totalAutomations;
  }

  /**
  * Order automation by AutomationConnectionFilterInput
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

  /**
   * Finds a subset of automations of a workspace using filter boundaries
   * @param workspaceSlug the slug of a workspace
   * @param filter an filter object
   * @returns A list of automations
   */
  findPaginatedAutomations = async (workspaceSlug: string, filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const automations = await this.prisma.automation.findMany({
      where: this.buildFindAutomationsQuery(workspaceSlug, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
      include: {
        automationTrigger: {
          include: {
            event: {
              include: {
                dialogue: true,
                question: true,
              },
            },
            actions: true,
          },
        },
        automationScheduled: {
          include: {
            actions: true,
            dialogueScope: true,
          },
        },
      },
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
        automationScheduled: {
          include: {
            actions: true,
          },
        },
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
                },
              },
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
    if (scope.type === AutomationConditionScopeType.QUESTION && scope.questionScope) {
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

    if (scope.type === AutomationConditionScopeType.DIALOGUE && scope.dialogueScope) {
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

    if (scope.type === AutomationConditionScopeType.WORKSPACE && scope.workspaceScope) {
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
   * Constructs a prisma object for removal of a scope based on specific conditions
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
    if (
      dbCondition?.dialogueScope?.id &&
      checkAgainstScope === AutomationConditionScopeType.DIALOGUE &&
      condition.scope.type !== AutomationConditionScopeType.DIALOGUE) {
      return { delete: true };
    }

    if (
      dbCondition?.questionScope?.id &&
      checkAgainstScope === AutomationConditionScopeType.QUESTION &&
      condition.scope.type !== AutomationConditionScopeType.QUESTION
    ) {
      return { delete: true };
    }

    if (
      dbCondition?.workspaceScope?.id &&
      checkAgainstScope === AutomationConditionScopeType.WORKSPACE &&
      condition.scope.type !== AutomationConditionScopeType.WORKSPACE
    ) {
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
      questionScope: (scope.type === AutomationConditionScopeType.QUESTION && mappedScope) ? {
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
      } : this.constructUpdateRemovalScope(dbCondition, condition, AutomationConditionScopeType.QUESTION),
      dialogueScope: (scope.type === AutomationConditionScopeType.DIALOGUE && mappedScope) ? {
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
      } : this.constructUpdateRemovalScope(dbCondition, condition, AutomationConditionScopeType.DIALOGUE),
      workspaceScope: (scope.type === AutomationConditionScopeType.WORKSPACE && mappedScope) ? {
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
      } : this.constructUpdateRemovalScope(dbCondition, condition, AutomationConditionScopeType.WORKSPACE),
    }
  }

  /**
   * Creates a Prisma-ready data object for CREATE of an AutomationCondition
   * @param condition an input object containing information for creating an AutomationCondition
   * @returns a Prisma-ready data object for creating of an AutomationCondition
   */
  constructCreateAutomationConditionData = (
    condition: CreateAutomationConditionInput
  ): (Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput |
    Prisma.Enumerable<Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput> |
    Prisma.AutomationConditionCreateManyAutomationConditionBuilderInput |
    Prisma.Enumerable<Prisma.AutomationConditionCreateManyAutomationConditionBuilderInput>) => {
    const { dialogueId, scope, questionId, operands, operator } = condition;
    // TODO: Introduce workspace-wide condition
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    return {
      scope: scope.type,
      operator,
      operands: {
        createMany: {
          data: operands.map((operand) => (
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
      questionScope: (scope.type === AutomationConditionScopeType.QUESTION && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        },
      } : undefined,
      dialogueScope: (scope.type === AutomationConditionScopeType.DIALOGUE && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        },
      } : undefined,
      workspaceScope: (scope.type === AutomationConditionScopeType.WORKSPACE && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        },
      } : undefined,
    };
  }

  /**
   * Constructs a CREATE data object for a conditionBuilder created by prisma
   * @param input CreateConditionBuilderInput
   * @returns a prisma CREATE data object for a conditionBuilder
   */
  constructCreateConditionBuilderData = (
    input: CreateConditionBuilderInput
  ): Prisma.AutomationConditionBuilderCreateInput => {
    let childBuilder;

    if (input.childBuilder) {
      childBuilder = this.constructCreateConditionBuilderData(input.childBuilder);
    }

    return {
      type: input.type,
      conditions: {
        create: input.conditions?.map((condition) => (
          this.constructCreateAutomationConditionData(condition)
        )) as Prisma.Enumerable<Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput>,
      },
      childConditionBuilder: {
        create: childBuilder,
      },
    }
  }

  /**
   * Creates a prisma-ready data object for creation of an AutomationScheduled
   * @param input an object containing all information necessary to create an AutomationScheduled
   * @returns a Prisma-ready data object for creation of an AutomationScheduled
   */
  buildCreateAutomationScheduleData = (
    input: CreateAutomationInput
  ): Prisma.AutomationScheduledCreateWithoutAutomationsInput => {
    const { actions, schedule } = input;

    return {
      ...schedule as Prisma.AutomationScheduledCreateInput,
      actions: {
        create: actions.map((action) => {
          return {
            type: action.type,
            apiKey: action.apiKey,
            endpoint: action.endpoint,
            payload: action.payload as Prisma.InputJsonObject || Prisma.JsonNull,
          }
        }),
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
    const { event, actions, conditionBuilder } = input;

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
        create: this.constructCreateConditionBuilderData(conditionBuilder as CreateConditionBuilderInput),
      },
      actions: {
        create: actions.map((action) => {
          return {
            type: action.type,
            apiKey: action.apiKey,
            endpoint: action.endpoint,
            payload: action.payload as Prisma.InputJsonObject || Prisma.JsonNull,
          }
        }),
      },
    }
  }

  /**
   * Finds AutomationConditions of an AutomationConditionBuilder by builder ID
   * @param builderId an ID of an AutomationConditionBuilder
   * @returns all the conditions of an AutomationConditionBuilder
   */
  findAutomationConditionsByConditionBuilderId = (builderId: string) => {
    return this.prisma.automationCondition.findMany({
      where: {
        automationConditionBuilderId: builderId,
      },
    });
  };

  /**
   * Removes all entries related to 'stale' AutomationConditions (conditions which exist in database not in input)
   * @param conditionBuilderId an ID of an AutomationConditionBuilder
   * @param inputConditionIds a list of IDs of conditions still in input
   */
  removeStaleConditionRelations = async (
    conditionBuilderId: string,
    idOverview: { builderIds: string[]; conditionIds: string[] },
    inputConditionIds: string[]
  ) => {
    const dbConditions = await this.findAutomationConditionsByConditionBuilderId(conditionBuilderId);
    const dbConditionIds = dbConditions.map((condition) => condition.id);
    const staleConditionIds = dbConditionIds.filter((conditionId) => !inputConditionIds.includes(conditionId));

    const allConditions = [...staleConditionIds, ...idOverview.conditionIds];

    await this.prisma.questionConditionScope.deleteMany({
      where: {
        automationConditionId: {
          in: allConditions,
        },
      },
    });

    await this.prisma.dialogueConditionScope.deleteMany({
      where: {
        automationConditionId: {
          in: allConditions,
        },
      },
    });

    await this.prisma.workspaceConditionScope.deleteMany({
      where: {
        automationConditionId: {
          in: allConditions,
        },
      },
    });

    await this.prisma.automationConditionOperand.deleteMany({
      where: {
        automationConditionId: {
          in: allConditions,
        },
      },
    });

    await this.prisma.automationCondition.deleteMany({
      where: {
        OR: {
          id: {
            in: allConditions,
          },
        },
      },
    });

    await this.prisma.automationConditionBuilder.deleteMany({
      where: {
        id: {
          in: idOverview.builderIds,
        },
      },
    });
  };

  /**
   * Constructs a set of both create and update prisma objects for a list of AutomationConditions
   * @param conditions A list of automation conditions. These can include existing and new automation conditions
   * @returns an object containing a set of prisma-ready objects for either create OR upserting conditions
   */
  constructUpdateAutomationConditionsData = async (
    conditions: UpdateConditionBuilderInput['conditions'],
    isExistingBuilder: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputConditionIds: string[]
  ): Promise<Prisma.AutomationConditionUpdateManyWithoutAutomationConditionBuilderInput |
    Prisma.AutomationConditionCreateNestedManyWithoutAutomationConditionBuilderInput> => {

    if (isExistingBuilder) {
      // eslint-disable-next-line max-len
      const upsertConditions: Prisma.Enumerable<Prisma.AutomationConditionUpsertWithWhereUniqueWithoutAutomationConditionBuilderInput>
        = await Promise.all(conditions.map(async (condition) => {
          return {
            where: {
              id: condition?.id || '-1',
            },
            create: this.constructCreateAutomationConditionData(
              condition
            ) as Prisma.AutomationConditionCreateWithoutAutomationConditionBuilderInput,
            update: await this.constructUpdateAutomationConditionData(condition),
          }
        }));

      return {
        upsert: upsertConditions,
      }

    } else {
      return {
        create: conditions.map((condition) => {
          return this.constructCreateAutomationConditionData(condition)
        }) as Prisma.Enumerable<Prisma.AutomationConditionCreateManyAutomationConditionBuilderInput>,
      };
    }
  }

  findStaleBuilderRelatedIds = async (
    conditionBuilder: UpdateConditionBuilderInput,
    idOverview: { builderIds: string[]; conditionIds: string[] }
  ) => {
    // If there is no nested builder id in input
    // => Check if there is any 'stale' builders in database
    if (!conditionBuilder.childBuilder?.id && conditionBuilder?.id) {
      const builder = await this.prisma.automationConditionBuilder.findUnique({
        where: {
          id: conditionBuilder.id,
        },
        include: {
          childConditionBuilder: {
            include: {
              conditions: true,
            },
          },
          conditions: {
            select: {
              id: true,
            },
          },
        },
      });
      // If there is no child builder in input data but there one exists in db
      // => Remove stale builder
      // => (BUT ALSO ALL ITS SHIT LEFTOVERS INCLUDING another childbuilder 🥲)
      if (builder?.childConditionBuilder) {
        idOverview.builderIds.push(builder?.childConditionBuilder.id);
        const conditionIds = builder.childConditionBuilder.conditions.map(
          (condition) => condition.id
        ).filter(isPresent);
        idOverview.conditionIds.push(...conditionIds);
        await this.findStaleBuilderRelatedIds(builder.childConditionBuilder as any, idOverview);
      }
    }

    return idOverview;
  }

  /**
   * Builds an prisma UPDATE data object for an AutomationConditionBuilder
   * @param conditionBuilder the input data
   * @param isRoot optional variable that checks whether conditionBUilder is a root conditionBuilder
   * @returns prisma UPDATE data object for an AutomationConditionBuilder
   */
  buildUpdateAutomationConditionBuilderData = async (
    conditionBuilder: UpdateConditionBuilderInput,
    isRoot = true
    // eslint-disable-next-line max-len
  ): Promise<Prisma.AutomationConditionBuilderUpdateWithoutAutomationTriggerInput | Prisma.AutomationConditionBuilderCreateWithoutParentConditionBuilderInput> => {
    let childConditionBuilder;
    const isExistingBuilder = (isRoot || !!conditionBuilder.id)
    const inputConditionIds = conditionBuilder.conditions.map((condition) => condition.id).filter(isPresent);

    if (conditionBuilder?.id) {
      // Remove 'stale' builder entries (including conditions, their scope(s) & operands)
      const idOverview = await this.findStaleBuilderRelatedIds(conditionBuilder, { builderIds: [], conditionIds: [] });
      await this.removeStaleConditionRelations(conditionBuilder.id, idOverview, inputConditionIds);
    }

    // Constructs update statements for conditions of builder
    const updateConditions = await this.constructUpdateAutomationConditionsData(
      conditionBuilder.conditions,
      isExistingBuilder,
      inputConditionIds
    );

    // If nested condition builder exists => recursively run this function again to update its content as well
    if (conditionBuilder.childBuilder) {
      const childBuilder = await this.buildUpdateAutomationConditionBuilderData(conditionBuilder.childBuilder, false);
      childConditionBuilder = childBuilder;
    };

    return {
      type: conditionBuilder.type,
      conditions: updateConditions,
      childConditionBuilder: childConditionBuilder ? {
        // If there is nested condition builder input data and no child builder previously existed => create childBuilder
        create: !conditionBuilder.childBuilder?.id ?
          childConditionBuilder as Prisma.AutomationConditionBuilderCreateWithoutAutomationTriggerInput :
          undefined,
        // If there is nested condition builder input data and child builder previously existed => update childBuilder
        update: conditionBuilder.childBuilder?.id ? childConditionBuilder : undefined,
      } : undefined,
    }
  };

  /**
   * Constructs a prisma-ready data object for updating of an AutomationScheduled
   * @param input the update input data
   * @returns A prisma-ready object used to update an AutomationScheduled
   */
  buildUpdateAutomationScheduledData(
    input: UpdateAutomationInput
  ): Prisma.AutomationScheduledUpdateInput {
    const { actions: inputActions, schedule } = input;

    const inputActionIds = inputActions.map((action) => action.id).filter(isPresent);

    return {
      ...schedule,
      dialogueScope: schedule?.dialogueScope || {
        disconnect: true,
      },
      minutes: schedule?.minutes,
      hours: schedule?.hours,
      dayOfMonth: schedule?.dayOfMonth,
      dayOfWeek: schedule?.dayOfWeek,
      month: schedule?.month,
      type: schedule?.type,
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
              payload: action?.payload as Prisma.InputJsonObject || Prisma.JsonNull,
            },
            update: {
              type: action.type,
              apiKey: action?.apiKey,
              endpoint: action?.endpoint,
              payload: action?.payload as Prisma.InputJsonObject || Prisma.JsonNull,
            },
          };
        }),
      },
    }
  }

  /**
   * Constructs a prisma-ready data object for updating of an AutomationTrigger
   * @param input the update input data
   * @returns A prisma-ready object used to update an AutomationTrigger
   */
  async buildUpdateAutomationTriggerData(input: UpdateAutomationInput): Promise<Prisma.AutomationTriggerUpdateInput> {
    const { event, actions: inputActions, conditionBuilder } = input;

    const inputActionIds = inputActions.map((action) => action.id).filter(isPresent);
    const updateConditionBuilderData = conditionBuilder
      ? await this.buildUpdateAutomationConditionBuilderData(conditionBuilder)
      : undefined;

    return {
      conditionBuilder: updateConditionBuilderData ? {
        update: updateConditionBuilderData,
      } : undefined,
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
              payload: action?.payload as Prisma.InputJsonObject || Prisma.JsonNull,
            },
            update: {
              type: action.type,
              apiKey: action?.apiKey,
              endpoint: action?.endpoint,
              payload: action?.payload as Prisma.InputJsonObject || Prisma.JsonNull,
            },
          };
        }),
      },
    }
  }

  /**
   * Enables/Disables an automation 
   * @param input an object containing the automation id as well as the state (true/false) of the automation
   */
  enableAutomation = async (input: NexusGenInputs['EnableAutomationInput']) => {
    return this.prisma.automation.update({
      where: {
        id: input.automationId,
      },
      data: {
        isActive: input.state,
      },
    });
  };

  /**
   * Updates an automation based on provided input
   * @param input an object containing all information necessary to update an automation
   * @returns an updated Automation
   */
  updateAutomation = async (input: UpdateAutomationInput) => {
    const { description, label, automationType } = input;
    const automation = await this.findAutomationById(input.id);
    const automationTriggerUpdateArgs = automationType === AutomationType.TRIGGER
      ? await this.buildUpdateAutomationTriggerData(input)
      : undefined;

    const automationScheduledUpdateArgs = automationType === AutomationType.SCHEDULED
      ? this.buildUpdateAutomationScheduledData(input)
      : undefined;

    return this.prisma.automation.update({
      where: {
        id: input.id,
      },
      data: {
        label: label,
        type: automationType,
        description,
        // TODO: Upgrade this when campaignAutomation is introduced (delete other automation entry on swap)
        automationTrigger: automationTriggerUpdateArgs && automation ? {
          upsert: {
            create: this.buildCreateAutomationTriggerData(input),
            update: automationTriggerUpdateArgs,
          },
        } : undefined,
        automationScheduled: automationScheduledUpdateArgs && automation ? {
          upsert: {
            create: this.buildCreateAutomationScheduleData(input) as Prisma.AutomationScheduledCreateInput,
            update: automationScheduledUpdateArgs,
          },
        } : undefined,
      },
      include: {
        automationScheduled: {
          include: {
            actions: true,
          },
        },
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
        automationTrigger: automationType === AutomationType.TRIGGER ? {
          create: this.buildCreateAutomationTriggerData(input),
        } : undefined,
        automationScheduled: automationType === AutomationType.SCHEDULED ? {
          create: this.buildCreateAutomationScheduleData(input),
        } : undefined,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
      include: {
        automationScheduled: {
          include: {
            actions: true,
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
        automations: {
          include: {
            automationTrigger: {
              include: {
                actions: true,
              },
            },
          },
        },
      },
    });

    return workspace?.automations || [];
  };
}
