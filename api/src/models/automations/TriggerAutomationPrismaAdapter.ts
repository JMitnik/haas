import {
  AutomationCondition, AutomationConditionScopeType, AutomationType,
  ConditionPropertyAggregateType, DialogueConditionScope,
  Prisma, PrismaClient, QuestionAspect, QuestionConditionScope,
  WorkspaceConditionScope,
} from '@prisma/client';
import { countBy } from 'lodash';
import { isPresent } from 'ts-is-present';

import {
  UpdateAutomationConditionInput, UpdateAutomationInput,
  CreateAutomationInput, CreateScopeDataInput, CreateAutomationConditionScopeInput,
  CreateAutomationConditionInput, ConditionPropertAggregateInput, CreateConditionBuilderInput,
  UpdateConditionBuilderInput,
} from './AutomationTypes';

export class TriggerAutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Make available to merge

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
            actions: {
              include: {
                channels: true,
              },
            },
          },
        },
      },
    })
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

}
