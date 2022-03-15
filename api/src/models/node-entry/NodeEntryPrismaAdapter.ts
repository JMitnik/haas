import { PrismaClient, Prisma, NodeEntry } from '@prisma/client';

class NodeEntryPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  create(data: Prisma.NodeEntryCreateInput) {
    return this.prisma.nodeEntry.create({
      data,
    });
  };

  async getNodeEntriesBySessionId(sessionId: string): Promise<NodeEntry[]> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        nodeEntries: {
          orderBy: {
            depth: 'asc',
          },
        },
      },
    });

    return session?.nodeEntries || [];
  };

  /**
   * Count by sesion id.
   * */
  countNodeEntriesBySessionId(sessionId: string) {
    return this.prisma.nodeEntry.count({ where: { sessionId } });
  };

  /**
   * Raw count of node-entries.
   * */
  count(where: Prisma.NodeEntryWhereInput): Promise<number> {
    return this.prisma.nodeEntry.count({ where });
  };

  /**
   * Find node-entry along with its sub-fields.
   * */
  async findNodeEntryValuesById(nodeEntryId: string) {
    const nodeEntry = await this.prisma.nodeEntry.findUnique({
      where: { id: nodeEntryId },
      include: {
        choiceNodeEntry: true,
        linkNodeEntry: true,
        registrationNodeEntry: true,
        sliderNodeEntry: true,
        textboxNodeEntry: true,
        videoNodeEntry: true,
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

  async deleteManyNodeEntries(sessionIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.nodeEntry.deleteMany({
      where: {
        sessionId: {
          in: sessionIds,
        },
      },
    },
    );
  };

  async deleteManyChoiceNodeEntries(nodeEntryIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.choiceNodeEntry.deleteMany({
      where: { nodeEntryId: { in: nodeEntryIds } },
    });
  };

  async deleteManyLinkNodeEntries(nodeEntryIds: string[]): Promise<Prisma.BatchPayload> {
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
