import {
  PrismaClient,
  Session, NodeEntry, NodeEntryCreateWithoutSessionInput, SessionWhereInput,
} from '@prisma/client';
import cleanInt from '../../utils/cleanInt';

const prisma = new PrismaClient();

class SessionResolver {
  static async uploadUserSession(obj: any, args: any, ctx: any) {
    const { dialogueId, entries } = args.uploadUserSessionInput;

    const session = await prisma.session.create({
      data: {
        dialogue: {
          connect: {
            id: dialogueId,
          },
        },
        nodeEntries: {
          create: entries.map(
            (entry: any) => SessionResolver.constructNodeEntry(entry),
          ),
        },
      },
    });

    // TODO: Replace this with email associated to dialogue (or fallback to company)
    const dialogueAgentMail = 'jmitnik@gmail.com';

    // TODO: Roundabout way, needs to be done in Prisma2 better
    const nodeEntries = await SessionResolver.getEntriesOfSession(session);
    const questionnaire = await prisma.dialogue.findOne({ where: { id: dialogueId } });

    ctx.services.triggerMailService.sendTrigger({
      to: dialogueAgentMail,
      userSession: {
        id: session.id,
        nodeEntries,
        questionnaire,
      },
    });

    return session;
  }

  static async getEntriesOfSession(session: Session): Promise<NodeEntry[]> {
    const entries = await Promise.all((
      await prisma.session.findOne({ where: { id: session.id } }).nodeEntries()).map(
      async (entry) => ({
        ...entry,
        relatedNode: await Promise.resolve(prisma.nodeEntry.findOne({
          where: {
            id: entry.id,
          },
        }).relatedNode()),
        values: await Promise.resolve(prisma.nodeEntry.findOne({
          where: {
            id: entry.id,
          },
        }).values()),
      }),
    ));

    return entries;
  }

  static constructDateRangeWhereInput(startDate: Date, endDate: Date): SessionWhereInput[] | [] {
    let dateRange: SessionWhereInput[] | [] = [];
    if (startDate && !endDate) {
      dateRange = [
        { createdAt: { gte: startDate } },
      ];
    } else if (!startDate && endDate) {
      dateRange = [
        { createdAt: { lte: endDate } },
      ];
    } else if (startDate && endDate) {
      dateRange = [
        { createdAt: { gte: startDate } },
        { createdAt: { lte: endDate } }];
    }
    return dateRange;
  }

  static constructNodeEntry(nodeEntry: any): NodeEntryCreateWithoutSessionInput {
    const valuesObject: any = { multiValues: { create: nodeEntry.data.multiValues || [] } };

    if (nodeEntry.data.numberValue) {
      valuesObject.numberValue = cleanInt(nodeEntry.data.numberValue);
    }

    if (nodeEntry.data.textValue) {
      valuesObject.textValue = nodeEntry.data.textValue;
    }

    return {
      relatedNode: {
        connect: {
          id: nodeEntry.nodeId,
        },
      },
      depth: nodeEntry.depth,
      values: {
        create: [valuesObject],
      },
    };
  }
}

export default SessionResolver;
