import { PrismaClient, Dialogue } from "@prisma/client";
import { DialoguePrismaAdapterType } from "./DialoguePrismaAdapterType";

class DialoguePrismaAdapter implements DialoguePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findDialogueIdsOfCustomer(customerId: string): Promise<Array<{id: string}>> {
    return this.prisma.dialogue.findMany({
      where: {
        customerId,
      },
      select: {
        id: true,
      },
    })
  }
}

export default DialoguePrismaAdapter;
