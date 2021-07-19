import { PrismaClient, Dialogue, DialogueUpdateInput, QuestionNode, Edge, DialogueCreateInput, DialogueInclude, DialogueSelect, Subset, DialogueCreateArgs, QuestionCondition } from "@prisma/client";
import { DialoguePrismaAdapterType } from "./DialoguePrismaAdapterType";

export type CreateDialogueInput = {
  id?: string
  title: string
  slug: string
  description: string
  creationDate?: Date | string
  updatedAt?: Date | string | null
  publicTitle?: string | null
  isOnline?: boolean
  isWithoutGenData?: boolean
  endScreenText?: string | null
  wasGeneratedWithGenData?: boolean
  customerId: string
};

class DialoguePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getDialogueByQuestionNodeId(nodeId: string): Promise<Dialogue | null> {
    return this.prisma.dialogue.findFirst({
      where: {
        questions: {
          some: {
            id: nodeId,
          },
        }
      },
    });
  }

  async getDialogueBySlugs(customerSlug: string, dialogueSlug: string): Promise<Dialogue | null> {
    const customer = await this.prisma.customer.findOne({
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
    return this.prisma.dialogue.findOne({
      where: {
        slug_customerId: {
          customerId,
          slug: dialogueSlug,
        }
      }
    });
  };

  getAllDialoguesWithTags() {
    return this.prisma.dialogue.findMany({
      include: {
        tags: true,
      },
    });
  }

  getDialogueById(dialogueId: string): Promise<Dialogue | null> {
    return this.prisma.dialogue.findOne({
      where: { id: dialogueId },
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
  }

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
  }

  async getEdgesByDialogueId(dialogueId: string): Promise<Edge[]> {
    const dialogue = await this.prisma.dialogue.findOne({
      where: {
        id: dialogueId,
      },
      include: {
        edges: true,
      },
    });

    const edges = dialogue?.edges;

    return edges || [];
  }
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
  }

  async getTagsByDialogueId(dialogueId: string) {
    const dialogue = await this.prisma.dialogue.findOne({
      where: { id: dialogueId },
      include: { tags: true },
    });

    return dialogue?.tags || [];
  }

  async getTemplateDialogue(dialogueId: string) {
    return this.prisma.dialogue.findOne({
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
            options: {
              select: {
                publicValue: true,
                value: true,
              },
            },
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
  }

  async create(input: Subset<DialogueCreateArgs, DialogueCreateArgs>) {
    return this.prisma.dialogue.create(input);
  }

  async createTemplate(input: CreateDialogueInput) {
    return this.prisma.dialogue.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        customer: {
          connect: {
            id: input.customerId
          }
        },
        questions: {
          create: [],
        }
      }
    });
  }

  async getDialogueWithNodesAndEdges(dialogueId: string) {
    return this.prisma.dialogue.findOne({
      where: { id: dialogueId },
      include: {
        questions: true,
        edges: {
          include: {
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
  }

  async setGeneratedWithGenData(dialogueId: string, isGeneratedWithGenData: boolean) {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: {
        wasGeneratedWithGenData: isGeneratedWithGenData,
      },
    });
  }

  async createEdges(
    dialogueId: string,
    edges: {
      parentNodeId: string,
      childNodeId: string,
      conditions: Array<{ conditionType: string, matchValue: string | null, renderMin: number | null, renderMax: number | null }>
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
              }
            },
            conditions: {
              create: edge.conditions,
            },
            childNode: {
              connect: {
                id: edge.childNodeId,
              }
            },
          })),
        },
      }
    })
  }

  async update(dialogueId: string, updateArgs: DialogueUpdateInput, include?: DialogueInclude | null | undefined): Promise<Dialogue> {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: updateArgs,
      include,
    });
  }

  async read(dialogueId: string) {
    return this.prisma.dialogue.findOne({
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
  }

  async delete(dialogueId: string): Promise<Dialogue> {
    return this.prisma.dialogue.delete({
      where: {
        id: dialogueId,
      }
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
}

export default DialoguePrismaAdapter;
