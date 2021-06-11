import { PrismaClient, NodeEntryWhereInput, NodeEntryCreateInput } from "@prisma/client";

import { NodeEntryPrismaAdapterType } from "./NodeEntryPrismaAdapterType";

class NodeEntryPrismaAdapter implements NodeEntryPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  create(data: NodeEntryCreateInput){
    return this.prisma.nodeEntry.create({
      data,
    });
  }


  async findManyNodeEntriesBySessionId(sessionId: string): Promise<(import("@prisma/client").NodeEntry & { choiceNodeEntry: import("@prisma/client").ChoiceNodeEntry | null; linkNodeEntry: import("@prisma/client").LinkNodeEntry | null; registrationNodeEntry: import("@prisma/client").RegistrationNodeEntry | null; sliderNodeEntry: import("@prisma/client").SliderNodeEntry | null; textboxNodeEntry: import("@prisma/client").TextboxNodeEntry | null; })[]> {
    const nodeEntries = await this.prisma.nodeEntry.findMany({
          where: { sessionId: sessionId },
          include: {
            // TODO: Add videoEmbeddedNodeValue here as well or is this one saved as choiceNodeEntry? Add FormNode?
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            sliderNodeEntry: true,
            textboxNodeEntry: true,
          },
          orderBy: {
            depth: 'asc',
          },
        });

        return nodeEntries;
  }
  count(where: NodeEntryWhereInput): Promise<number> {
    return this.prisma.nodeEntry.count({ where, });
  }
  
  async getChildNodeEntriesById(nodeId: string) {
    const nodeEntry = await this.prisma.nodeEntry.findOne({
      where: { id: nodeId },
      include: {
        choiceNodeEntry: true,
        linkNodeEntry: true,
        registrationNodeEntry: true,
        sliderNodeEntry: true,
        textboxNodeEntry: true,
        formNodeEntry: {
          include: {
            values: {
              include: {
                relatedField: true,
              },
            },
          },
        },
      },
    });
    return nodeEntry;
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
