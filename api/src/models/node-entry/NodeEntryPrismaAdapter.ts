import { PrismaClient, NodeEntryWhereInput, NodeEntryCreateInput, BatchPayload, ChoiceNodeEntry, LinkNodeEntry, NodeEntry, RegistrationNodeEntry, SliderNodeEntry, TextboxNodeEntry } from "@prisma/client";

class NodeEntryPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  create(data: NodeEntryCreateInput) {
    return this.prisma.nodeEntry.create({
      data,
    });
  }


  async findManyNodeEntriesBySessionId(sessionId: string): Promise<(NodeEntry & { choiceNodeEntry: ChoiceNodeEntry | null; linkNodeEntry: LinkNodeEntry | null; registrationNodeEntry: RegistrationNodeEntry | null; sliderNodeEntry: SliderNodeEntry | null; textboxNodeEntry: TextboxNodeEntry | null; })[]> {
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

  getAmountOfNodeEntriesBySessionId(sessionId: string) {
    return this.prisma.nodeEntry.count(
      {
        where: {
          sessionId,
        }
      });
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

  async deleteManyNodeEntries(sessionIds: string[]): Promise<BatchPayload> {
    return this.prisma.nodeEntry.deleteMany(
      {
        where: {
          sessionId: {
            in: sessionIds,
          },
        },
      },
    );
  }

  async deleteManyChoiceNodeEntries(nodeEntryIds: string[]): Promise<BatchPayload> {
    return this.prisma.choiceNodeEntry.deleteMany(
      { where: { nodeEntryId: { in: nodeEntryIds } } },
    );
  }


  async deleteManyLinkNodeEntries(nodeEntryIds: string[]): Promise<BatchPayload> {
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
