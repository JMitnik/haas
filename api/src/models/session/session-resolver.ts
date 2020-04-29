import { PrismaClient, Dialogue, NodeEntryCreateWithoutSessionInput } from '@prisma/client';
import cleanInt from '../../utils/cleanInt';

const prisma = new PrismaClient();

class SessionResolver {
  static async uploadUserSession(obj: any, args: any, ctx: any) {
    const { questionnaireId, entries } = args.uploadUserSessionInput;

    const session = await prisma.session.create({
      data: {
        dialogue: {
          connect: {
            id: questionnaireId,
          },
        },
        nodeEntries: {
          create: entries.map(
            (entry: any) => SessionResolver.constructNodeEntry(entry),
          ),
        },
      },
    });

    ctx.services.triggerMailService.sendTrigger({ to: 'jmitnik@gmail.com', userSession: session });

    return session;
  }

  static constructNodeEntry(nodeEntry: any) : NodeEntryCreateWithoutSessionInput {
    const valuesObject: any = { multiValues: { create: nodeEntry.data.multiValues || [] } }; // multiValues: { create: nodeEntry.data.multiValues || [], }

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
