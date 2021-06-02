import { PrismaClient, Dialogue, DialogueUpdateInput } from "@prisma/client";
import { DialoguePrismaAdapterType } from "./DialoguePrismaAdapterType";

class DialoguePrismaAdapter implements DialoguePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  update(dialogueId: string, updateArgs: DialogueUpdateInput): Promise<Dialogue> {
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
        questions: {
          select: {
            id: true,
          },
        },
        edges: {
          select: {
            id: true,
          },
        },
        sessions: {
          select: {
            id: true,
          },
        },
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
