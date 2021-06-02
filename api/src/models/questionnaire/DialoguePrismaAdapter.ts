import { PrismaClient, Dialogue, DialogueUpdateInput, QuestionNode, Edge, DialogueCreateInput, DialogueInclude, DialogueSelect, Subset, DialogueCreateArgs } from "@prisma/client";
import { DialoguePrismaAdapterType } from "./DialoguePrismaAdapterType";

class DialoguePrismaAdapter implements DialoguePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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

  async update(dialogueId: string, updateArgs: DialogueUpdateInput, include?: DialogueInclude | null | undefined): Promise<Dialogue> {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: updateArgs,
      include,
    });
  }
  
  async read(dialogueId: string){
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

  async findDialogueIdsOfCustomer(customerId: string): Promise<Array<{id: string}>> {
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
