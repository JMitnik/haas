import { prisma, NodeEntry } from '../../generated/prisma-client/index';
import cleanInt from '../../utils/cleanInt';
import { NodeEntryCreateWithoutSessionInput, Session } from '../../generated/resolver-types';

class SessionResolver {
  static async uploadUserSession(obj: any, args: any, ctx: any) {
    const { questionnaireId, entries } = args.uploadUserSessionInput;

    const session = await prisma.createSession({
      questionnaire: {
        connect: {
          id: questionnaireId,
        },
      },
      nodeEntries: {
        create: entries.map((entry: any) => SessionResolver.constructNodeEntry(entry)),
      },
    });

    // TODO: Replace this with email associated to dialogue (or fallback to company)
    const dialogueAgentMail = 'jmitnik@gmail.com';

    // TODO: Roundabout way, needs to be done in Prisma2 better
    const nodeEntries = await SessionResolver.getEntriesOfSession(session);
    const questionnaire = await prisma.questionnaire({ id: questionnaireId });

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
      await prisma.session({ id: session.id }).nodeEntries()).map(async (entry) => ({
      ...entry,
      relatedNode: await Promise.resolve(prisma.nodeEntry({
        id: entry.id,
      }).relatedNode()),
      values: await Promise.resolve(prisma.nodeEntry({
        id: entry.id,
      }).values()),
    })));

    return entries;
  }

  static constructNodeEntry(nodeEntry: any) : NodeEntryCreateWithoutSessionInput {
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
