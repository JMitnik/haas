import {
  NodeEntry,
  NodeEntryCreateWithoutSessionInput, PrismaClient, Session, SessionWhereInput,
} from '@prisma/client';
import { isAfter, subSeconds } from 'date-fns';

import TriggerService from '../trigger/TriggerService';
import cleanInt from '../../utils/cleanInt';

const prisma = new PrismaClient();

// TODO: Rename Session to Interaction
class SessionService {
  /**
   * Uploads a user-session from the client
   * @param obj
   * @param args
   * @param ctx
   */
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
          create: entries.map((entry: any) => SessionService.constructNodeEntry(entry)),
        },
      },
    });

    // SMS SERVICE
    const questionIds = entries.map((entry: any) => entry.nodeId);
    const dialogueTriggers = await TriggerService.findTriggersByQuestionIds(questionIds);

    dialogueTriggers.forEach(async (trigger) => {
      const currentDate = new Date();
      const safeToSend = !trigger.lastSent || isAfter(subSeconds(currentDate, 60), trigger.lastSent);
      if (safeToSend) {
        // TODO: Do we have to await this function? can just let it run on the side
        await prisma.trigger.update(({ where: { id: trigger.id }, data: { lastSent: currentDate } }));
        const { data } = entries.find((entry: any) => entry.nodeId === trigger.relatedNodeId);
        const condition = trigger.conditions[0];
        const { isMatch, value } = TriggerService.match(condition, data);
        if (isMatch) {
          trigger.recipients.forEach((recipient) => {
            if (recipient.phone) {
              const twilioPhoneNumber = '+3197010252775';
              const smsBody = `'${trigger.name}' was triggered by someone who entered the value '${value}'.`;
              ctx.services.smsService.sendSMS(twilioPhoneNumber, recipient.phone, smsBody, true);
            }
          });
        }
      }
    });

    // TODO: Replace this with email associated to dialogue (or fallback to company)
    const dialogueAgentMail = 'jmitnik@gmail.com';

    // TODO: Roundabout way, needs to be done in Prisma2 better
    const nodeEntries = await SessionService.getEntriesOfSession(session);
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

export default SessionService;
