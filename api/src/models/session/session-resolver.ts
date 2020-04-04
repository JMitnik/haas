import { prisma } from '../../generated/prisma-client/index';
import cleanInt from '../../utils/cleanInt';
import { NodeEntryCreateWithoutSessionInput } from '../../generated/resolver-types';

class SessionResolver {
  static async uploadUserSession(obj: any, args: any, ctx: any) {
    const { uploadUserSessionInput } = args;

    const session = await prisma.createSession({
      nodeEntries: {
        create: uploadUserSessionInput.entries.map(
          (entry: any) => SessionResolver.constructNodeEntry(entry),
        ),
      },
    });

    ctx.services.triggerMailService.sendTrigger({ to: 'jmitnik@gmail.com', userSession: session });

    return session;
  }

  static constructNodeEntry(nodeEntry: any): NodeEntryCreateWithoutSessionInput {
    return {
      // todo: Add relatedEdge back
      relatedNode: {
        connect: {
          id: nodeEntry.nodeId,
        },
      },
      depth: nodeEntry.depth,
      values: {
        create: [{
          numberValue: cleanInt(nodeEntry.data.numberValue),
          textValue: nodeEntry.data.textValue,
          multiValues: {
            create: nodeEntry.data.multiValues,
          },
        }],
      },
    };
  }
}

export default SessionResolver;
