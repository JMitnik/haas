import {
  Trigger,
  TriggerCondition,
  TriggerOrderByInput,
  TriggerUpdateInput,
  TriggerWhereInput,
  User,
  UserWhereUniqueInput,
} from '@prisma/client';
import { isAfter, subSeconds } from 'date-fns';
import _ from 'lodash';

// eslint-disable-next-line import/no-cycle
import { isPresent } from 'ts-is-present';
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import NodeEntryService, { NodeEntryWithTypes } from '../node-entry/NodeEntryService';
import { smsService } from '../../services/sms/sms-service';
import prisma from '../../config/prisma';

interface TriggerWithSendData extends Trigger {
  recipients: User[];
  conditions: TriggerCondition[];
  relatedNode: {
    questionDialogue: {
      title: string;
    } | null;
  } | null;
}

class TriggerService {
  static getSearchTermFilter = (searchTerm: string) => {
    if (!searchTerm) {
      return [];
    }

    const searchTermFilter: TriggerWhereInput[] = [
      {
        name: {
          contains: searchTerm,
        },
      },
    ];

    return searchTermFilter;
  };

  static orderUsersBy = (
    triggers: Array<Trigger>,
    orderBy: { id: string, desc: boolean },
  ) => {
    if (orderBy.id === 'name') {
      return _.orderBy(triggers, (trigger) => trigger.name, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.id === 'medium') {
      return _.orderBy(triggers, (trigger) => trigger.medium, orderBy.desc ? 'desc' : 'asc');
    } if (orderBy.id === 'type') {
      return _.orderBy(triggers, (trigger) => trigger.type, orderBy.desc ? 'desc' : 'asc');
    }

    return triggers;
  };

  static slice = (
    entries: Array<any>,
    offset: number,
    limit: number,
    pageIndex: number,
  ) => ((offset + limit) < entries.length
    ? entries.slice(offset, (pageIndex + 1) * limit)
    : entries.slice(offset, entries.length));

  static formatOrderBy(orderByArray?: NexusGenInputs['PaginationSortInput'][]): (TriggerOrderByInput|undefined) {
    if (!orderByArray?.length) return undefined;

    const orderBy = orderByArray[0];

    return {
      medium: orderBy.by === 'medium' ? orderBy.desc ? 'desc' : 'asc' : undefined,
      type: orderBy.by === 'type' ? orderBy.desc ? 'desc' : 'asc' : undefined,
      name: orderBy.by === 'name' ? orderBy.desc ? 'desc' : 'asc' : undefined,
    };
  }

  static paginatedTriggers = async (
    customerSlug: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    // Build filter
    const triggerWhereInput: TriggerWhereInput = { customer: { slug: customerSlug } };

    const searchTermFilter = TriggerService.getSearchTermFilter(paginationOpts.search || '');
    triggerWhereInput.OR = searchTermFilter.length ? searchTermFilter : undefined;

    const triggers = await prisma.trigger.findMany({
      where: triggerWhereInput,
      take: paginationOpts.limit || undefined,
      skip: paginationOpts.offset || undefined,
      orderBy: TriggerService.formatOrderBy(paginationOpts.orderBy || undefined),
    });

    const triggerTotal = await prisma.trigger.count({ where: { customer: { slug: customerSlug } } });
    const totalPages = paginationOpts.limit ? Math.ceil(triggerTotal / (paginationOpts.limit)) : 1;
    const currentPage = paginationOpts.pageIndex && paginationOpts.pageIndex <= totalPages
      ? paginationOpts.pageIndex : 1;

    const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
      nrPages: totalPages,
      pageIndex: currentPage,
    };

    return {
      triggers,
      pageInfo,
    };
  };

  static sendTrigger = (
    trigger: TriggerWithSendData,
    recipient: User,
    value: string | number | undefined,
  ) => {
    if (value && recipient.phone && (trigger.medium === 'PHONE' || trigger.medium === 'BOTH')) {
      // TODO: Change
      const twilioPhoneNumber = '+3197010252775';
      const smsBody = `Dear recipient, ${trigger.name} of ${trigger.relatedNode?.questionDialogue?.title} has been triggered with value: '${value}'. `;

      smsService.send(twilioPhoneNumber, recipient.phone, smsBody, true)
    }
    // TODO: Add the mail check (below) in this body as well.
  };

  static async tryTrigger(entries: NodeEntryWithTypes[], trigger:TriggerWithSendData, smsService: TriggerSMSService) {
    const currentDate = new Date();
    const safeToSend = !trigger.lastSent || isAfter(subSeconds(currentDate, 5), trigger.lastSent);

    // TODO-LATER: Put this part into a queue
    if (!safeToSend) return;

    await prisma.trigger.update(({ where: { id: trigger.id }, data: { lastSent: currentDate } }));

    const nodeEntry = entries.find((entry) => entry.relatedNodeId === trigger.relatedNodeId);
    const condition = trigger.conditions[0];

    if (!nodeEntry) return;
    const { isMatch, value } = TriggerService.match(condition, nodeEntry);

    if (isMatch && value) {
      trigger.recipients.forEach((recipient) => TriggerService.sendTrigger(trigger, recipient, value, smsService));
    }
  }

  static tryTriggers = async (entries: NodeEntryWithTypes[], smsService: TriggerSMSService) => {
    const questionIds = entries.map((entry) => entry.relatedNodeId).filter(isPresent);
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
      relatedNode: {
        select: {
          questionDialogue: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  static match(triggerCondition: TriggerCondition, entry: NodeEntryWithTypes) {
    let conditionMatched;

    switch (triggerCondition.type) {
      case 'HIGH_THRESHOLD': {
        conditionMatched = { isMatch: false };

        if (!entry.sliderNodeEntry?.value || !triggerCondition?.maxValue) {
          break;
        }

        if (entry.sliderNodeEntry?.value > triggerCondition.maxValue) {
          conditionMatched = { isMatch: true, value: entry.sliderNodeEntry?.value };
        }

        break;
      }

      case 'LOW_THRESHOLD': {
        conditionMatched = { isMatch: false };

        if (!entry.sliderNodeEntry?.value || !triggerCondition?.minValue) {
          break;
        }

        if (entry.sliderNodeEntry?.value < triggerCondition.minValue) {
          conditionMatched = { isMatch: true, value: entry.sliderNodeEntry?.value };
        }

        break;
      }

      case 'TEXT_MATCH': {
        conditionMatched = { isMatch: false };

        const textEntry = NodeEntryService.getTextValueFromEntry(entry);

        if (!textEntry || !triggerCondition?.textValue) {
          break;
        }

        if (textEntry === triggerCondition.textValue) {
          conditionMatched = { isMatch: true, value: textEntry };
        }

        break;
      }

      case 'INNER_RANGE': {
        conditionMatched = { isMatch: false };

        const score = entry.sliderNodeEntry?.value;

        if (!score || !triggerCondition.maxValue || !triggerCondition.minValue) {
          break;
        }

        if (score > triggerCondition.maxValue) {
          conditionMatched = {
            isMatch: score <= triggerCondition.maxValue && triggerCondition?.minValue <= score,
            value: score,
          };
        }

        break;
      }

      case 'OUTER_RANGE': {
        conditionMatched = { isMatch: false };

        const score = entry.sliderNodeEntry?.value;

        if (!score || !triggerCondition.maxValue || !triggerCondition.minValue) {
          break;
        }

        if (score > triggerCondition.maxValue) {
          conditionMatched = {
            isMatch: score >= triggerCondition.maxValue && triggerCondition?.minValue >= score,
            value: score,
          };
        }

        break;
      }

      default:
        conditionMatched = { isMatch: false };
    }

    return conditionMatched;
  }

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
    newConditions: Array<NexusGenInputs['TriggerConditionInputType']>,
    triggerId: string,
  ) => {
    const upsertedConditionsIds = await Promise.all(newConditions.map(async (condition) => {
      if (!condition.type) return null;

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

      return null;
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

    const recipientUpdateArgs: any = {};
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
