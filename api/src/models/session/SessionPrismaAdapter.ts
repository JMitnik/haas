import { PrismaClient, Session } from "@prisma/client";

import NodeEntryService from "../node-entry/NodeEntryService";
import { CreateSessionInput } from "./SessionPrismaAdapterType";

class SessionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  updateDelivery(sessionId: string, deliveryId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        delivery: { connect: { id: deliveryId } }
      }
    })
  }

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

  getSessionById(sessionId: string): Promise<Session | null> {
    return this.prisma.session.findOne({
      where: {
        id: sessionId,
      },
    });
  }

  async deleteMany(sessionIds: string[]) {
    return this.prisma.session.deleteMany({
      where: {
        id: {
          in: sessionIds,
        }
      }
    })
  }

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
  }

}

export default SessionPrismaAdapter;
