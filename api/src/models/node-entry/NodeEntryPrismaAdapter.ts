import { PrismaClient, Prisma, NodeEntry } from '@prisma/client';

class NodeEntryPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  findDialogueStatisticsRootEntries = async (
    dialogueIds: string[],
    startDate: Date,
    endDate: Date,
  ) => {
    return this.prisma.nodeEntry.findMany({
      where: {
        AND: [
          {
            session: {
              dialogueId: {
                in: dialogueIds,
              },
            },
            creationDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            depth: 0,
          },
          {
            sliderNodeEntry: {
              isNot: null,
            },
          },
        ],
      },
      include: {
        session: {
          select: {
            dialogueId: true,
          },
        },
        sliderNodeEntry: true,
      },
    });
  }

  /**
   * Finds all sub topic node entries within a date range by question id
   * @param questionId
   * @param startDateTime
   * @param endDateTime
   * @returns a list of sliderNodeEntries as well as node entries of its children
   */
  findNodeEntriesByQuestionId = async (
    questionId: string, startDateTime: Date, endDateTime: Date
  ) => {

    const sessions = await this.prisma.session.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
        nodeEntries: {
          some: {
            relatedNodeId: questionId,
          },
        },
      },
      include: {
        nodeEntries: {
          where: {
            relatedEdge: {
              parentNodeId: questionId,
            },
          },
          include: {
            choiceNodeEntry: true,
          },
        },
      },
    });
    return sessions;
  }

  /**
   * Finds all node entries within a date range based on a specific topic
   * @param dialogueId
   * @param topic
   * @param startDateTime
   * @param endDateTime
   * @returns a list of node entries where answered value = input topic
   */
  findNodeEntriesByTopic = async (dialogueId: string, topic: string, startDateTime: Date, endDateTime: Date) => {
    const sessions = await this.prisma.session.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
        dialogueId: dialogueId,
        nodeEntries: {
          some: {
            choiceNodeEntry: {
              value: topic,
            },
          },
        },
      },
      include: {
        nodeEntries: {
          where: {
            relatedEdge: {
              conditions: {
                some: {
                  matchValue: topic,
                },
              },
            },
          },
          include: {
            choiceNodeEntry: true,
          },
        },
      },
    });

    return sessions;

    // const targetNodeEntries = await this.prisma.choiceNodeEntry.findMany({
    //   where: {
    //     nodeEntry: {
    //       creationDate: {
    //         gte: startDateTime,
    //         lte: endDateTime,
    //       },
    //       session: {
    //         dialogueId: dialogueId,
    //       },
    //       // NOT: {
    //       //   inputSource: 'INIT_GENERATED',
    //       // },
    //     },
    //     value: topic,
    //   },
    //   include: {
    //     nodeEntry: {
    //       include: {
    //         session: {
    //           select: {
    //             mainScore: true,
    //           },
    //         },
    //         relatedNode: {
    //           select: {
    //             options: true,
    //             children: {
    //               where: {
    //                 conditions: {
    //                   some: {
    //                     matchValue: topic,
    //                   },
    //                 },
    //               },
    //               select: {
    //                 childNode: {
    //                   select: {
    //                     options: true,
    //                   },
    //                 },
    //                 isRelatedNodeOfNodeEntries: {
    //                   select: {
    //                     id: true,
    //                     choiceNodeEntry: {
    //                       select: {
    //                         value: true,
    //                       },
    //                     },
    //                     session: {
    //                       select: {
    //                         mainScore: true,
    //                       },
    //                     },
    //                   },
    //                   where: {
    //                     creationDate: {
    //                       gte: startDateTime,
    //                       lte: endDateTime,
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    // return targetNodeEntries;
  }

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
