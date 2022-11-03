import {
  AutomationType,
  Prisma, PrismaClient,
} from 'prisma/prisma-client';
import { cloneDeep } from 'lodash';
import { NexusGenInputs } from '../../generated/nexus';

import {
  UpdateAutomationInput,
  CreateAutomationInput,
  defaultAutomationFields,
} from './AutomationTypes';
import { ScheduledAutomationPrismaAdapter } from './ScheduledAutomationPrismaAdapter';

export class AutomationPrismaAdapter {
  prisma: PrismaClient;
  scheduledAutomationPrismaAdapter: ScheduledAutomationPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.scheduledAutomationPrismaAdapter = new ScheduledAutomationPrismaAdapter(prisma);
  }

  public async findAutomationActionById(automationActionId: string) {
    return this.prisma.automationAction.findUnique({
      where: {
        id: automationActionId,
      },
      include: {
        channels: true,
      },
    });
  }


  /**
   * Deletes an automation from the database
   * @param input
   * @returns the deleted automation
   */
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

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
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
    // const automationTriggerUpdateArgs = automationType === AutomationType.TRIGGER
    //   ? await this.triggerAutomationPrismaAdapter.buildUpdateAutomationTriggerData(input)
    //   : undefined;

    const automationScheduledUpdateArgs = automationType === AutomationType.SCHEDULED
      ? this.scheduledAutomationPrismaAdapter.buildUpdateAutomationScheduledData(input)
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
        // automationTrigger: automationTriggerUpdateArgs && automation ? {
        //   upsert: {
        //     create: this.triggerAutomationPrismaAdapter.buildCreateAutomationTriggerData(input),
        //     update: automationTriggerUpdateArgs,
        //   },
        // } : undefined,
        automationScheduled: automationScheduledUpdateArgs && automation ? {
          upsert: {
            create: this.scheduledAutomationPrismaAdapter.buildCreateAutomationScheduleData(
              input
            ) as Prisma.AutomationScheduledCreateInput,
            update: automationScheduledUpdateArgs,
          },
        } : undefined,
      },
      include: defaultAutomationFields.include,
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
        // automationTrigger: automationType === AutomationType.TRIGGER ? {
        //   create: this.triggerAutomationPrismaAdapter.buildCreateAutomationTriggerData(input),
        // } : undefined,
        automationScheduled: automationType === AutomationType.SCHEDULED ? {
          create: this.scheduledAutomationPrismaAdapter.buildCreateAutomationScheduleData(input),
        } : undefined,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
      include: defaultAutomationFields.include,
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
        automations: defaultAutomationFields,
      },
    });

    return workspace?.automations || [];
  };
}
