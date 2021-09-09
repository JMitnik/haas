import { Prisma, PrismaClient, Session } from "@prisma/client";
import { NexusGenFieldTypes, NexusGenInputNames, NexusGenInputs } from "../../generated/nexus";

import NodeEntryService from "../node-entry/NodeEntryService";
import { CreateSessionInput } from "./SessionPrismaAdapterType";

const constructSessionFilter = (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput']) => {
  return Prisma.validator<Prisma.SessionWhereInput>()({
    dialogueId: dialogueId,
    createdAt: {
      gte: filter?.startDate ? new Date(filter.startDate) : undefined,
      lte: filter?.endDate ? new Date(filter.endDate) : undefined,
    },
    AND: filter?.search ? [{
      OR: [
        {
          nodeEntries: {
            some: {
              choiceNodeEntry: { value: { contains: filter.search } },
            }
          }
        },
        {
          delivery: {
            OR: [
              {
                deliveryRecipientFirstName: { contains: filter.search, mode: 'insensitive' }
              },
              {
                deliveryRecipientLastName: { contains: filter.search, mode: 'insensitive' }
              },
            ] || []
          }
        }
      ]
    }] : undefined,
  })
}

class SessionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  findSessions = async (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput']) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.prisma.session.findMany({
      where: constructSessionFilter(dialogueId, filter),
      skip: offset,
      take: perPage,
    });

    return sessions;
  }

  countSessions = async (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput']) => {
    return await this.prisma.session.count({
      where: constructSessionFilter(dialogueId, filter),
    });
  }

  updateDelivery(sessionId: string, deliveryId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        delivery: { connect: { id: deliveryId } }
      },
    });
  };

  /**
   * Creates a session in the database.
   * */
  createSession(data: CreateSessionInput) {
    const { device, originUrl, dialogueId, entries, totalTimeInSec } = data;
    return this.prisma.session.create({
      data: {
        originUrl,
        device,
        totalTimeInSec,
        nodeEntries: {
          create: entries.map((entry) => NodeEntryService.constructCreateNodeEntryFragment(entry))
        },
        dialogue: {
          connect: {
            id: dialogueId,
          },
        },
      },
      include: {
        nodeEntries: {
          // TODO: Can we define these fields in one place (right now, it exists everywhere).
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            textboxNodeEntry: true,
            relatedNode: true,
            formNodeEntry: { include: { values: true } },
            videoNodeEntry: true,
            sliderNodeEntry: true,
          },
        },
      },
    });
  };

  /**
   * Fetches single session from database.
   * */
  findSessionById(sessionId: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        nodeEntries: {
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            relatedNode: true,
            sliderNodeEntry: true,
          },
        },
      },
    });
  };

  async deleteMany(sessionIds: string[]) {
    return this.prisma.session.deleteMany({
      where: {
        id: {
          in: sessionIds,
        },
      },
    });
  };

  createFakeSession(data: (
    {
      createdAt: Date,
      dialogueId: string,
      rootNodeId: string,
      simulatedRootVote: number,
      simulatedChoiceNodeId: string,
      simulatedChoiceEdgeId?: string,
      simulatedChoice: string,
    })) {

    return this.prisma.session.create({
      data: {
        nodeEntries: {
          create: [{
            depth: 0,
            creationDate: data.createdAt,
            relatedNode: {
              connect: { id: data.rootNodeId },
            },
            sliderNodeEntry: {
              create: { value: data.simulatedRootVote },
            },
            inputSource: 'INIT_GENERATED',
          },
          {
            depth: 1,
            creationDate: data.createdAt,
            relatedNode: { connect: { id: data.simulatedChoiceNodeId } },
            relatedEdge: { connect: { id: data.simulatedChoiceEdgeId } },
            choiceNodeEntry: {
              create: { value: data.simulatedChoice },
            },
          },
          ],
        },
        dialogue: {
          connect: { id: data.dialogueId },
        },
      },
    });
  };
};

export default SessionPrismaAdapter;
