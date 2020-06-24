import {
  PrismaClient,
  Trigger,
  TriggerCondition,
  TriggerUpdateInput,
  User,
  UserUpdateManyWithoutTriggersInput,
  UserWhereUniqueInput,
} from '@prisma/client';

import { isAfter, subSeconds } from 'date-fns';
import SMSService from '../../services/sms/sms-service';
import TriggerSMSService from '../../services/sms/trigger-sms-service';

const prisma = new PrismaClient();

class TriggerService {
  static sendTrigger = (
    trigger: Trigger,
    recipient: User,
    value: string | number | undefined,
    smsService: TriggerSMSService,
  ) => {
    if (value && recipient.phone && (trigger.medium === 'PHONE' || trigger.medium === 'BOTH')) {
      smsService.sendTriggerSMS(trigger, recipient.phone, value);
    }
    // TODO: Add the mail check (below) in this body as well.
  };

  static tryTrigger = async (entries: Array<any>, trigger: Trigger & {
    recipients: User[];
    conditions: TriggerCondition[];
  },
    smsService: TriggerSMSService) => {
    const currentDate = new Date();
    const safeToSend = !trigger.lastSent || isAfter(subSeconds(currentDate, 60), trigger.lastSent);

    if (safeToSend) {
      // TODO: Do we have to await this function? can just let it run on the side
      await prisma.trigger.update(({ where: { id: trigger.id }, data: { lastSent: currentDate } }));

      const { data } = entries.find((entry) => entry.nodeId === trigger.relatedNodeId);
      const condition = trigger.conditions[0];
      const { isMatch, value } = TriggerService.match(condition, data);

      if (isMatch) {
        trigger.recipients.forEach((recipient) => {
          TriggerService.sendTrigger(trigger, recipient, value, smsService);
        });
      }
    }
  };

  static tryTriggers = async (entries: Array<any>, smsService: TriggerSMSService) => {
    const questionIds = entries.map((entry: any) => entry.nodeId);
    const dialogueTriggers = await TriggerService.findTriggersByQuestionIds(questionIds);

    dialogueTriggers.forEach(async (trigger) => {
      await TriggerService.tryTrigger(entries, trigger, smsService);
    });
  };

  static findTriggersByDialogueId = async (dialogueId: string) => prisma.trigger.findMany({
    where: {
      relatedNode: {
        questionDialogueId: dialogueId,
      },
    },
  });

  static findTriggersByQuestionIds = async (questionIds: Array<string>) => prisma.trigger.findMany({
    where: {
      type: 'QUESTION',
      relatedNodeId: {
        in: questionIds,
      },
    },
    include: {
      recipients: true,
      conditions: true,
    },
  });

  static match = (
    triggerCondition: TriggerCondition,
    answer: { numberValue: number | null, textValue: string | null },
  ) => {
    let conditionMatched;

    switch (triggerCondition.type) {
      case 'HIGH_THRESHOLD':
        conditionMatched = (answer?.numberValue && triggerCondition?.maxValue)
          ? { isMatch: answer.numberValue > triggerCondition.maxValue, value: answer.numberValue }
          : { isMatch: false };
        break;
      case 'LOW_THRESHOLD':
        conditionMatched = (answer?.numberValue && triggerCondition.minValue)
          ? { isMatch: answer.numberValue < triggerCondition.minValue, value: answer.numberValue }
          : { isMatch: false };
        break;
      case 'TEXT_MATCH':
        conditionMatched = (answer?.textValue && triggerCondition.textValue)
          ? {
            isMatch: answer.textValue.toLowerCase() === triggerCondition.textValue.toLowerCase(),
            value: answer.textValue,
          }
          : { isMatch: false };
        break;
      case 'OUTER_RANGE':
        conditionMatched = (answer?.numberValue && triggerCondition.minValue && triggerCondition.maxValue)
          ? {
            isMatch: answer.numberValue > triggerCondition.maxValue
              || answer.numberValue < triggerCondition.minValue,
            value: answer.numberValue,
          }
          : { isMatch: false };
        break;
      case 'INNER_RANGE':
        conditionMatched = (answer?.numberValue && triggerCondition.minValue && triggerCondition.maxValue)
          ? {
            isMatch: (answer.numberValue < triggerCondition.maxValue
              && answer.numberValue > triggerCondition.minValue),
            value: answer.numberValue,
          }
          : { isMatch: false };
        break;
      default:
        conditionMatched = { isMatch: false };
    }

    return conditionMatched;
  };

  static updateRelatedQuestion = (
    dbTriggerRelatedNodeId: string | null | undefined,
    newRelatedNodeId: string | null | undefined,
    updateTriggerArgs: TriggerUpdateInput,
  ): TriggerUpdateInput => {
    if (newRelatedNodeId && newRelatedNodeId !== dbTriggerRelatedNodeId) {
      updateTriggerArgs.relatedNode = { connect: { id: newRelatedNodeId } };
    } else if (!newRelatedNodeId) {
      updateTriggerArgs.relatedNode = { disconnect: true };
    }
    return updateTriggerArgs;
  };

  static updateConditions = async (
    dbTriggerConditions: Array<TriggerCondition>,
    newConditions: Array<TriggerCondition>,
    triggerId: string,
  ) => {
    const upsertedConditionsIds = await Promise.all(newConditions.map(async (condition) => {
      const upsertTriggerCondition = await prisma.triggerCondition.upsert({
        where: { id: condition.id || -1 },
        create: {
          type: condition.type,
          minValue: condition.minValue,
          maxValue: condition.maxValue,
          textValue: condition.textValue,
          trigger: {
            connect: {
              id: triggerId,
            },
          },
        },
        update: {
          type: condition.type,
          minValue: condition.minValue,
          maxValue: condition.maxValue,
          textValue: condition.textValue,
        },
      });

      return upsertTriggerCondition.id;
    }));

    await Promise.all(dbTriggerConditions.map(async (condition) => {
      if (!upsertedConditionsIds.includes(condition.id)) {
        const deletedCondition = await prisma.triggerCondition.delete({ where: { id: condition.id } });
        return deletedCondition.id;
      }
    }));
  };

  static updateRecipients = (
    dbTriggerRecipients: Array<User>,
    newRecipients: Array<string>,
    updateTriggerArgs: TriggerUpdateInput,
  ): TriggerUpdateInput => {
    const newRecipientObjects = newRecipients.map((recipientId) => ({ id: recipientId }));

    const deleteRecipientObjects: UserWhereUniqueInput[] = [];
    dbTriggerRecipients.forEach((recipient) => {
      if (!newRecipients.includes(recipient.id)) {
        deleteRecipientObjects.push({ id: recipient.id });
      }
    });

    const recipientUpdateArgs: UserUpdateManyWithoutTriggersInput = {};
    if (newRecipientObjects.length > 0) {
      recipientUpdateArgs.connect = newRecipientObjects;
    }

    if (deleteRecipientObjects.length > 0) {
      recipientUpdateArgs.disconnect = deleteRecipientObjects;
    }

    updateTriggerArgs.recipients = recipientUpdateArgs;
    return updateTriggerArgs;
  };
}

export default TriggerService;
