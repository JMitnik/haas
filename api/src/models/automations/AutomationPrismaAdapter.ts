import { Prisma, PrismaClient } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { isPresent } from 'ts-is-present';
import { NexusGenInputs } from '../../generated/nexus';

import {
  UpdateAutomationConditionInput, UpdateAutomationInput, FullAutomationWithRels, CreateAutomationInput, CreateScopeDataInput, CreateAutomationConditionScopeInput, CreateAutomationConditionInput, AutomationTrigger
} from './AutomationTypes';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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
        ]
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
  findAutomationById = async (automationId: string): Promise<FullAutomationWithRels | null> => {
    return this.prisma.automation.findUnique({
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
              }
            },
            conditions: {
              include: {
                questionScope: {
                  include: {
                    aggregate: true,
                  }
                },
                dialogueScope: {
                  include: {
                    aggregate: true,
                  }
                },
                matchValue: true,
                workspaceScope: {
                  include: {
                    aggregate: true,
                  }
                },
                dialogue: true,
                question: true,
              }
            },
            actions: true,
          },
        },
      },
    });
  }

  /**
   * Creates a Prisma-ready data object for creation of an AutomationConditionScope 
   * @param scope a generic scope object containing the scope and either question, dialogue or workspace scope
   * @returns a Prisma-ready data object for creation of an AutomationConditionScope 
   */
  constructCreateAutomationConditionScopeData = (scope: CreateAutomationConditionScopeInput): CreateScopeDataInput | undefined => {
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
   * Creates a Prisma-ready data object for UPDATE of an AutomationCondition
   * @param condition an input object containing information for updating an AutomationCondition
   * @returns a Prisma-ready data object for updating of an AutomationCondition 
   */
  constructUpdateAutomationConditionData = (condition: UpdateAutomationConditionInput): Prisma.AutomationConditionUpdateWithoutAutomationTriggerInput => {
    const { dialogueId, scope, questionId, matchValue, operator } = condition;
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    return {
      scope: scope.type,
      operator,
      matchValue: {
        update: {
          type: matchValue.type,
          textValue: matchValue.textValue,
          dateTimeValue: matchValue.dateTimeValue,
          numberValue: matchValue.numberValue,
        }
      },
      question: questionId ? {
        connect: {
          id: questionId,
        },
      } : { disconnect: true },
      dialogue: dialogueId ? {
        connect: {
          id: dialogueId,
        }
      } : { disconnect: true },
      questionScope: (scope.type === 'QUESTION' && mappedScope) ? {
        update: {
          aggregate: {
            update: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : { disconnect: true }, // TODO: For all scopes If 1-1 do delete, else disconnect
      dialogueScope: (scope.type === 'DIALOGUE' && mappedScope) ? {
        update: {
          aggregate: {
            update: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : { disconnect: true },
      workspaceScope: (scope.type === 'WORKSPACE' && mappedScope) ? {
        update: {
          aggregate: {
            update: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : { disconnect: true },
    }
  }

  /**
   * Creates a Prisma-ready data object for CREATE of an AutomationCondition
   * @param condition an input object containing information for creating an AutomationCondition
   * @returns a Prisma-ready data object for creating of an AutomationCondition 
   */
  constructCreateAutomationConditionData = (condition: CreateAutomationConditionInput): Prisma.AutomationConditionCreateWithoutAutomationTriggerInput => {
    const { dialogueId, scope, questionId, matchValue, operator } = condition;
    // TODO: Introduce workspace-wide condition
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    return {
      scope: scope.type,
      operator,
      matchValue: {
        create: {
          type: matchValue.type,
          textValue: matchValue.textValue,
          dateTimeValue: matchValue.dateTimeValue,
          numberValue: matchValue.numberValue,
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
        }
      } : undefined,
      questionScope: (scope.type === 'QUESTION' && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : undefined,
      dialogueScope: (scope.type === 'DIALOGUE' && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : undefined,
      workspaceScope: (scope.type === 'WORKSPACE' && mappedScope) ? {
        create: {
          aggregate: {
            create: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : undefined,
    };
  }

  /**
   * Creates a prisma-ready data object for creation of an AutomationTrigger
   * @param input an object containing all information necessary to create an AutomationTrigger
   * @returns a Prisma-ready data object for creation of an AutomationTrigger
   */
  buildCreateAutomationTriggerData = (input: CreateAutomationInput): Prisma.AutomationTriggerCreateWithoutAutomationInput => {
    const { event, actions, conditions } = input;

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
            }
          } : undefined,
        },
      },
      conditions: {
        create: conditions.map((condition) => this.constructCreateAutomationConditionData(condition)),
      },
      actions: {
        create: actions,
      },
    }
  }

  /**
   * Creates a prisma-ready data object for updating of an AutomationTrigger
   * @param input an object containing all information necessary to update an AutomationTrigger
   * @returns a Prisma-ready data object for updating of an AutomationTrigger
   */
  buildUpdateAutomationTriggerData = (input: UpdateAutomationInput): Prisma.AutomationTriggerUpdateInput => {
    const { event, actions: inputActions, conditions: inputConditions } = input;

    const inputActionIds = inputActions.map((action) => action.id).filter(isPresent);
    const inputConditionIds = inputConditions.map((condition) => condition.id).filter(isPresent);

    return {
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
            }
          } : { disconnect: true },
        }
      },
      actions: {
        // Remove actions which are not selected in front-end
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
            },
            update: {
              type: action.type,
            },
          };
        }),
      },
      conditions: {
        deleteMany: {
          id: {
            notIn: inputConditionIds,
          },
        },
        upsert: inputConditions.map((condition) => {
          return {
            where: {
              id: condition?.id || '-1',
            },
            create: this.constructCreateAutomationConditionData(condition),
            update: this.constructUpdateAutomationConditionData(condition),
          }
        })
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
          update: this.buildUpdateAutomationTriggerData(input),
        } : undefined,
      }
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
      }
    });
    return workspace?.automations || [];
  };

}
