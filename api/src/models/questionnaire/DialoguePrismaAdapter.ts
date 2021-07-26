import {
  PrismaClient,
  Dialogue,
  DialogueUpdateInput,
  Edge,
  DialogueInclude,
  Subset,
  DialogueCreateArgs,
  LinkTypeEnum,
  NodeType,
  FormNodeFieldType,
  VideoEmbeddedNodeCreateWithoutQuestionNodeInput
} from "@prisma/client";

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

export interface CreateQuestionInput {
  id?: string,
  isRoot?: boolean,
  isLeaf?: boolean,
  title: string,
  type: NodeType,
  overrideLeafId?: string,
  dialogueId?: string,
  videoEmbeddedNode?: VideoEmbeddedNodeCreateWithoutQuestionNodeInput,
  options?: {
    publicValue?: string | null;
    value: string;
    position: number | null;
    overrideLeafId?: string;
  }[],
  links?: Array<{
    title: string | null;
    type: LinkTypeEnum;
    url: string;
    iconUrl: string | null;
    backgroundColor: string | null
  }>,
  form?: {
    helperText?: string;
    fields: Array<{
      label: string,
      type: FormNodeFieldType,
      isRequired: boolean,
      position: number,
    }>,
  },
  sliderNode?: {
    markers: Array<{
      label: string,
      subLabel: string,
      range: { start: number | null, end: number | null },
    }>
  }
}

export type CreateQuestionsInput = Array<CreateQuestionInput>;

class DialoguePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

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
              }
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
                  }
                } : undefined
              })),
            } : undefined,
            overrideLeaf: question.overrideLeafId ? {
              connect: {
                id: question.overrideLeafId,
              }
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
        }
      },
      include: {
        questions: true,
      }
    });
    return dialogue.questions;
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
