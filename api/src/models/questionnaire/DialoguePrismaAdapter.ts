import {
  Prisma,
  PrismaClient,
  Dialogue,
  Edge,
} from '@prisma/client';
import { NexusGenInputs } from 'generated/nexus';
import { cloneDeep } from 'lodash';

import { CreateQuestionsInput, CreateDialogueInput } from './DialoguePrismaAdapterType';

class DialoguePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  async createNodes(dialogueId: string, questions: CreateQuestionsInput) {

    const dialogue = await this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: {
        questions: {
          create: questions.map((question) => ({
            id: question.id,
            isRoot: question.isRoot,
            isLeaf: question.isLeaf,
            title: question.title,
            type: question.type,
            videoEmbeddedNode: question.videoEmbeddedNode?.videoUrl ? {
              create: {
                videoUrl: question.videoEmbeddedNode.videoUrl,
              },
            } : undefined,
            links: question.links?.length ? {
              create: question.links,
            } : undefined,
            options: question.options?.length ? {
              create: question.options.map(({ overrideLeafId, position, publicValue, value }) => ({
                value,
                position,
                publicValue,
                overrideLeaf: overrideLeafId ? {
                  connect: {
                    id: overrideLeafId,
                  },
                } : undefined,
              })),
            } : undefined,
            overrideLeaf: question.overrideLeafId ? {
              connect: {
                id: question.overrideLeafId,
              },
            } : undefined,
            form: question.form ? {
              create: {
                fields: {
                  create: question.form?.fields,
                },
              },
            } : undefined,
            sliderNode: question.sliderNode ? {
              create: {
                markers: {
                  create: question?.sliderNode?.markers?.map((marker) => ({
                    label: marker?.label,
                    subLabel: marker?.subLabel,
                    range: {
                      create: {
                        start: marker?.range?.start,
                        end: marker?.range?.end,
                      },
                    },
                  })),
                },
              },
            } : undefined,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return dialogue.questions;
  };

  async update(dialogueId: string, updateArgs: Prisma.DialogueUpdateInput, include?: Prisma.DialogueInclude | null | undefined): Promise<Dialogue> {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: updateArgs,
      include,
    });
  };

  getDialogueByQuestionNodeId(nodeId: string): Promise<Dialogue | null> {
    return this.prisma.dialogue.findFirst({
      where: {
        questions: {
          some: {
            id: nodeId,
          },
        },
      },
    });
  }

  async getDialogueBySlugs(customerSlug: string, dialogueSlug: string): Promise<Dialogue | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        slug: customerSlug,
      },
      include: {
        dialogues: {
          where: {
            slug: dialogueSlug,
          },
        },
      },
    });

    const dialogue = customer?.dialogues[0];
    return dialogue || null;
  }

  getDialogueBySlug(customerId: string, dialogueSlug: string): Promise<Dialogue | null> {
    return this.prisma.dialogue.findUnique({
      where: {
        slug_customerId: {
          customerId,
          slug: dialogueSlug,
        },
      },
    });
  };

  getAllDialoguesWithTags() {
    return this.prisma.dialogue.findMany({
      include: {
        tags: true,
      },
    });
  };

  getDialogueById(dialogueId: string): Promise<Dialogue | null> {
    return this.prisma.dialogue.findUnique({
      where: { id: dialogueId },
    });
  };

  getCampaignVariantsByDialogueId(dialogueId: string) {
    return this.prisma.campaignVariant.findMany({
      where: { dialogueId },
    });
  }

  getCTAsByDialogueId(dialogueId: string) {
    return this.prisma.questionNode.findMany({
      where: {
        AND: [
          { questionDialogueId: dialogueId },
          { isLeaf: true },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        form: {
          include: {
            fields: true,
          },
        },
      },
    });
  };

  getQuestionsByDialogueId(dialogueId: string) {
    return this.prisma.questionNode.findMany({
      where: {
        AND: [
          { questionDialogueId: dialogueId },
          {
            isLeaf: false,
          },
        ],
      },
      orderBy: {
        creationDate: 'asc',
      },
      include: {
        form: {
          include: {
            fields: true,
          },
        },
        sliderNode: {
          include: {
            markers: {
              include: {
                range: true,
              },
            },
          },
        },
      },
    });
  };

  async getEdgesByDialogueId(dialogueId: string): Promise<Edge[]> {
    const dialogue = await this.prisma.dialogue.findUnique({
      where: {
        id: dialogueId,
      },
      include: {
        edges: true,
      },
    });

    const edges = dialogue?.edges;
    return edges || [];
  };

  async getRootQuestionByDialogueId(dialogueId: string) {
    return this.prisma.questionNode.findFirst({
      where: {
        questionDialogueId: dialogueId,
        isRoot: true,
      },
      include: {
        form: {
          include: {
            fields: true,
          },
        },
        sliderNode: {
          include: {
            markers: {
              include: {
                range: true,
              },
            },
          },
        },
      },
    });
  };

  async getTagsByDialogueId(dialogueId: string) {
    const dialogue = await this.prisma.dialogue.findUnique({
      where: { id: dialogueId },
      include: { tags: true },
    });

    return dialogue?.tags || [];
  };

  async getTemplateDialogue(dialogueId: string) {
    return this.prisma.dialogue.findUnique({
      where: {
        id: dialogueId,
      },
      include: {
        edges: {
          include: {
            conditions: true,
            childNode: {
              select: {
                id: true,
              },
            },
            parentNode: {
              select: {
                id: true,
              },
            },
          },
        },
        questions: {
          include: {
            links: true,
            videoEmbeddedNode: true,
            sliderNode: {
              include: {
                markers: {
                  include: {
                    range: true,
                  },
                },
              },
            },
            form: {
              include: {
                fields: true,
              },
            },
            options: true,
            overrideLeaf: {
              select: {
                id: true,
              },
            },
            isOverrideLeafOf: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  };

  async create(input: Prisma.Subset<Prisma.DialogueCreateArgs, Prisma.DialogueCreateArgs>) {
    return this.prisma.dialogue.create(input);
  };

  getCustomerType(input: CreateDialogueInput) {
    if (input.customer?.create && input.customer.slug && input.customer.name) {
      return {
        create: {
          id: input?.customer?.id,
          slug: input.customer.slug,
          name: input.customer?.name,
        },
      };
    } else if (!input.customer?.create && input.customer?.id) {
      return {
        connect: {
          id: input.customer.id,
        },
      };
    }
  }

  async createTemplate(input: CreateDialogueInput) {
    const customerType = this.getCustomerType(input);
    return customerType && this.prisma.dialogue.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        customer: customerType,
        questions: {
          create: [],
        },
      },
      include: {
        customer: true,
      },
    });
  };

  async getDialogueWithNodesAndEdges(dialogueId: string) {
    return this.prisma.dialogue.findUnique({
      where: { id: dialogueId },
      include: {
        questions: true,
        edges: {
          include: {
            parentNode: true,
            conditions: true,
            childNode: true,
          },
        },
      },
    });
  }

  async connectTags(dialogueId: string, tags: { id: string }[]) {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: {
        tags: {
          connect: tags,
        },
      },
      include: {
        tags: true,
      },
    });
  };

  async setGeneratedWithGenData(dialogueId: string, isGeneratedWithGenData: boolean) {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: {
        wasGeneratedWithGenData: isGeneratedWithGenData,
      },
    });
  };

  async createEdges(
    dialogueId: string,
    edges: {
      parentNodeId: string;
      childNodeId: string;
      conditions: Array<{ conditionType: string; matchValue: string | null; renderMin: number | null; renderMax: number | null }>;
    }[]
  ) {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: {
        edges: {
          create: edges?.map((edge) => ({
            parentNode: {
              connect: {
                id: edge.parentNodeId,
              },
            },
            conditions: {
              create: edge.conditions,
            },
            childNode: {
              connect: {
                id: edge.childNodeId,
              },
            },
          })),
        },
      },
    });
  };

  async read(dialogueId: string) {
    return this.prisma.dialogue.findUnique({
      where: {
        id: dialogueId,
      },
      include: {
        CampaignVariant: true,
        customer: true,
        tags: true,
        questions: true,
        edges: true,
        sessions: true,
      },
    });
  };

  async delete(dialogueId: string): Promise<Dialogue> {
    return this.prisma.dialogue.delete({
      where: {
        id: dialogueId,
      },
    });
  };

  async findDialoguesByCustomerId(customerId: string) {
    return this.prisma.dialogue.findMany({
      where: {
        customerId,
      },
      include: {
        tags: true,
      },
    });
  };

  async findDialogueIdsOfCustomer(customerId: string): Promise<Array<{ id: string }>> {
    return this.prisma.dialogue.findMany({
      where: {
        customerId,
      },
      select: {
        id: true,
      },
    });
  };

  /**
  * Build a dialogueConnection prisma query based on the filter parameters.
  * @param customerSlug the slug of a workspace
  * @param filter a filter containing information in regard to used search queries, date ranges and order based on column
  */
  buildFindDialoguesQuery = (workspaceSlug: string, filter?: NexusGenInputs['DialogueConnectionFilterInput'] | null): Prisma.DialogueWhereInput => {
    let dialogueWhereInput: Prisma.DialogueWhereInput = {
      customer: {
        slug: workspaceSlug,
      },
      //TODO: Add private option here
    }

    if (filter?.searchTerm) {
      dialogueWhereInput = {
        ...cloneDeep(dialogueWhereInput),
        OR: [
          { title: { contains: filter.searchTerm, mode: 'insensitive' } },
          { description: { contains: filter.searchTerm, mode: 'insensitive' } },
          {
            tags: {
              some: {
                name: {
                  contains: filter.searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      }
    }

    return dialogueWhereInput;
  }


  /**
  * Order automation by AutomationConnectionFilterInput
  * @param filter
  */
  buildOrderByQuery = (filter?: NexusGenInputs['DialogueConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.DialogueOrderByWithRelationInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
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
  findPaginatedDialogues = async (workspaceSlug: string, filter?: NexusGenInputs['DialogueConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 10;

    const dialogues = await this.prisma.dialogue.findMany({
      where: this.buildFindDialoguesQuery(workspaceSlug, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
    });

    return dialogues;
  }

  /**
   * Counts the amount of automation within specific filter boundaries
   * @param workspaceSlug the slug of a workspace
   * @param filter an filter object to determine boundaries to look within
   * @returns The amount of automations within a specific set of filter boundaries
   */
  countDialogues = async (workspaceSlug: string, filter?: NexusGenInputs['DialogueConnectionFilterInput'] | null) => {
    const totalAutomations = await this.prisma.dialogue.count({
      where: this.buildFindDialoguesQuery(workspaceSlug, filter),
    });
    return totalAutomations;
  }

};

export default DialoguePrismaAdapter;
