import { PrismaClient } from "@prisma/client";

import { NodeEntryPrismaAdapterType } from "./NodeEntryPrismaAdapterType";

class NodeEntryPrismaAdapter implements NodeEntryPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  
  async deleteManyNodeEntries(sessionIds: string[]): Promise<import("@prisma/client").BatchPayload> {
    return  this.prisma.nodeEntry.deleteMany(
      {
        where: {
          sessionId: {
            in: sessionIds,
          },
        },
      },
    );
  }

  async deleteManyChoiceNodeEntries(nodeEntryIds: string[]): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.choiceNodeEntry.deleteMany(
      { where: { nodeEntryId: { in: nodeEntryIds } } },
    );
  }


  async deleteManyLinkNodeEntries(nodeEntryIds: string[]): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.linkNodeEntry.deleteMany(
      { where: { nodeEntryId: { in: nodeEntryIds } } },
    );
  }

  async deleteManyRegistrationNodeEntries(textBoxNodeEntryIds: string[]) {
    return this.prisma.registrationNodeEntry.deleteMany(
      { where: { nodeEntryId: { in: textBoxNodeEntryIds } } },
    );
  };

  async deleteManyTextBoxNodeEntries(textBoxNodeEntryIds: string[]) {
    return this.prisma.textboxNodeEntry.deleteMany(
      { where: { nodeEntryId: { in: textBoxNodeEntryIds } } },
    );
  };

  async deleteManySliderNodeEntries(sliderNodeEntryIds: string[]) {
    return this.prisma.sliderNodeEntry.deleteMany(
      { where: { nodeEntryId: { in: sliderNodeEntryIds } } },
    );
  };

  async getNodeEntriesBySessionIds(sessionIds: string[]) {
    return this.prisma.nodeEntry.findMany({
      where: {
        sessionId: {
          in: sessionIds,
        },
      },
    });
  };
  
};

export default NodeEntryPrismaAdapter;
