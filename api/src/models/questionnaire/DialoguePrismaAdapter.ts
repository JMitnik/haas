import { PrismaClient, Dialogue, DialogueUpdateInput, QuestionNode, Edge } from "@prisma/client";
import { DialoguePrismaAdapterType } from "./DialoguePrismaAdapterType";

class DialoguePrismaAdapter implements DialoguePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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

  async update(dialogueId: string, updateArgs: DialogueUpdateInput): Promise<Dialogue> {
    return this.prisma.dialogue.update({
      where: {
        id: dialogueId,
      },
      data: updateArgs,
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
