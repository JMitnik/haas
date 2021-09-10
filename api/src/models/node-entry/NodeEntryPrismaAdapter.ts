import { PrismaClient, Prisma } from "@prisma/client";

import { NodeEntryWithTypes } from "./NodeEntryServiceType";

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

  async getNodeEntriesBySessionId(sessionId: string): Promise<NodeEntryWithTypes[]> {
    const nodeEntries = await this.prisma.nodeEntry.findMany({
      where: { sessionId: sessionId },
      include: {
        choiceNodeEntry: true,
        linkNodeEntry: true,
        registrationNodeEntry: true,
        sliderNodeEntry: true,
        textboxNodeEntry: true,
        formNodeEntry: { include: { values: true } },
        videoNodeEntry: true,
      },
      orderBy: {
        depth: 'asc',
      },
    });

    return nodeEntries;
  };

  /**
   * Count by sesion id.
   * */
  countNodeEntriesBySessionId(sessionId: string) {
    return this.prisma.nodeEntry.count({ where: { sessionId, } });
  };

  /**
   * Raw count of node-entries.
   * */
  count(where: Prisma.NodeEntryWhereInput): Promise<number> {
    return this.prisma.nodeEntry.count({ where, });
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
  /**
   * Deletes all node entries by session id (NOTE: child node entries (e.g. slider, choice) need to be removed before)
   * @param sessionIds A list of IDs representing the session of which the node entries should be removed
   * @returns the deleted node entries
   */
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

  async deleteManyFormNodeEntries(nodeEntryIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.formNodeEntry.deleteMany({
      where: { nodeEntryId: { in: nodeEntryIds } }
    });
  };

  async deleteManyVideoNodeEntries(nodeEntryIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.videoNodeEntry.deleteMany({
      where: { nodeEntryId: { in: nodeEntryIds } }
    });
  };

  async deleteManyChoiceNodeEntries(nodeEntryIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.choiceNodeEntry.deleteMany({
      where: { nodeEntryId: { in: nodeEntryIds } }
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
