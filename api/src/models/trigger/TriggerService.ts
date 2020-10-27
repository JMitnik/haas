import {
  ColourSettings,
  Customer,
  CustomerInclude,
  CustomerSettings,
  Trigger,
  TriggerCondition,
  TriggerOrderByInput,
  TriggerUpdateInput,
  TriggerWhereInput,
  User,
  UserWhereUniqueInput,
} from '@prisma/client';
import { isAfter, subSeconds } from 'date-fns';
import { isPresent } from 'ts-is-present';
import _ from 'lodash';

// eslint-disable-next-line import/no-cycle
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import { CustomerWithCustomerSettings } from '../customer/Customer';
import { SessionWithEntries } from '../session/SessionTypes';
import { mailService } from '../../services/mailings/MailService';
import { smsService } from '../../services/sms/SmsService';
import NodeEntryService, { NodeEntryWithTypes } from '../node-entry/NodeEntryService';
import makeTriggerMailTemplate from '../../services/mailings/templates/makeTriggerMailTemplate';
import prisma from '../../config/prisma';

interface TriggerWithSendData extends Trigger {
  recipients: User[];
  conditions: TriggerCondition[];
  customer: CustomerWithCustomerSettings | null;
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
      { name: { contains: searchTerm } },
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

  static sendMailTrigger(trigger: TriggerWithSendData, recipient: User, session: SessionWithEntries) {
    const triggerBody = makeTriggerMailTemplate(recipient.firstName || 'User', session, trigger?.customer?.settings?.colourSettings?.primary);

    mailService.send({
      body: triggerBody,
      recipient: recipient.email,
      subject: 'A HAAS alert has been triggered',
    });
  }

  static sendSmsTrigger(trigger: TriggerWithSendData, recipient: User, session: SessionWithEntries, values: Array<{value: string | number | undefined, type: string}>) {
    if (!recipient.phone) return;

    const mappedValues = values.map((value) => `${value.type} -> ${value.value}`);
    const joinedValues = mappedValues.join(', ');

    smsService.send(recipient.phone, `HAAS: Your Alert "${trigger.name}" was triggered because of the following condition(s): ${joinedValues}`);
  }

  static sendTrigger = (
    trigger: TriggerWithSendData,
    recipient: User,
    session: SessionWithEntries,
    values: any,
  ) => {
    switch (trigger.medium) {
      case 'EMAIL':
        if (!recipient.email) return;
        TriggerService.sendMailTrigger(trigger, recipient, session);
        break;

      case 'PHONE':
        if (!recipient.phone) return;
        TriggerService.sendSmsTrigger(trigger, recipient, session, values);
        break;

      case 'BOTH':
        if (recipient.email) TriggerService.sendMailTrigger(trigger, recipient, session);
        if (recipient.phone) TriggerService.sendSmsTrigger(trigger, recipient, session, values);
        break;

      default:
        break;
    }
    // if (value && recipient.email && (trigger.medium === 'EMAIL' || trigger.medium === '' ))
    // TODO: Add the mail check (below) in this body as well.
  };

  static async tryTrigger(session: SessionWithEntries, trigger: TriggerWithSendData) {
    const currentDate = new Date();
    const safeToSend = !trigger.lastSent || isAfter(subSeconds(currentDate, 5), trigger.lastSent);

    // TODO-LATER: Put this part into a queue
    if (!safeToSend) return;

    await prisma.trigger.update(({ where: { id: trigger.id }, data: { lastSent: currentDate } }));

    const questionsOfTrigger = await prisma.questionOfTrigger.findMany({
      where: {
        triggerId: trigger.id,
      },
      include: {
        question: true,
        triggerCondition: true,
      },
    });

    const triggerTargets = questionsOfTrigger.map((questionOfTrigger) => {
      const { questionId, triggerCondition } = questionOfTrigger;
      const nodeEntry = session.nodeEntries.find((entry) => entry.relatedNodeId && questionId === entry.relatedNodeId);
      return { condition: triggerCondition, nodeEntry };
    });

    if (!triggerTargets.length) return;
    const matchResults = TriggerService.matchMulti(triggerTargets);

    const rejected = _.reject(matchResults, (matchResult) => matchResult?.isMatch === true);

    if (!rejected.length) {
      const values = matchResults.map((result) => ({ value: result?.value, type: result?.conditionType }));
      trigger.recipients.forEach((recipient) => TriggerService.sendTrigger(trigger, recipient, session, values));
    }
  }

  static tryTriggers = async (session: SessionWithEntries) => {
    const questionIds = session.nodeEntries?.map((entry) => entry.relatedNodeId).filter(isPresent);
    const dialogueTriggers = await TriggerService.findTriggersByQuestionIds(questionIds);

    dialogueTriggers.forEach(async (trigger) => {
      await TriggerService.tryTrigger(session, trigger);
    });
  };

  static findTriggersByDialogueId = async (dialogueId: string) => prisma.trigger.findMany({
    where: {
      relatedNode: {
        questionDialogueId: dialogueId,
      },
    },
    include: {
      customer: {
        include: {
          settings: {
            include: {
              colourSettings: true,
            },
          },
        },
      },
    },
  });

  static findTriggersByQuestionIds = async (questionIds: Array<string>) => {
    const questionOfTriggerEntries = await prisma.questionOfTrigger.findMany({
      where: {
        questionId: {
          in: questionIds,
        },
      },
    });

    const triggerIds = questionOfTriggerEntries.map((entry) => entry.triggerId);

    return prisma.trigger.findMany({
      where: {
        type: 'QUESTION',
        id: {
          in: triggerIds,
        },
      },
      include: {
        recipients: true,
        conditions: true,
        customer: {
          include: {
            settings: {
              include: {
                colourSettings: true,
              },
            },
          },
        },
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
  };

  static matchMulti(triggerTargets: {
    condition: TriggerCondition;
    nodeEntry: NodeEntryWithTypes | undefined;
  }[]) {
    const matchResults = triggerTargets.map((triggerTarget) => triggerTarget.nodeEntry && TriggerService.match(triggerTarget.condition, triggerTarget.nodeEntry));
    return matchResults;
  }

  static match(triggerCondition: TriggerCondition, entry: NodeEntryWithTypes) {
    let conditionMatched;

    switch (triggerCondition.type) {
      case 'HIGH_THRESHOLD': {
        conditionMatched = { isMatch: false };

        if (!entry.sliderNodeEntry?.value || !triggerCondition?.maxValue) {
          break;
        }

        if (entry.sliderNodeEntry?.value > triggerCondition.maxValue) {
          conditionMatched = { isMatch: true, value: entry.sliderNodeEntry?.value, conditionType: triggerCondition.type };
        }

        break;
      }

      case 'LOW_THRESHOLD': {
        conditionMatched = { isMatch: false };

        if (!entry.sliderNodeEntry?.value || !triggerCondition?.minValue) {
          break;
        }

        if (entry.sliderNodeEntry?.value < triggerCondition.minValue) {
          conditionMatched = { isMatch: true, value: entry.sliderNodeEntry?.value, conditionType: triggerCondition.type };
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
          conditionMatched = { isMatch: true, value: textEntry, conditionType: triggerCondition.type };
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
            conditionType: triggerCondition.type,
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
            conditionType: triggerCondition.type,
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
      const upsertQuestionOfTrigger = await prisma.questionOfTrigger.upsert({
        where: {
          questionId_triggerId: {
            questionId: condition.questionId || '-1',
            triggerId: triggerId || '-1',
          },
        },
        create: {
          question: {
            connect: {
              id: condition.questionId,
            },
          },
          trigger: {
            connect: {
              id: triggerId,
            },
          },
          triggerCondition: {
            create: {
              type: condition.type || undefined,
              minValue: condition.minValue,
              maxValue: condition.maxValue,
              textValue: condition.textValue,
              trigger: {
                connect: {
                  id: triggerId,
                },
              },
            },
          },
        },
        update: {
          question: {
            connect: {
              id: condition.questionId,
            },
          },
          triggerCondition: {
            update: {
              type: condition.type || undefined,
              minValue: condition.minValue,
              maxValue: condition.maxValue,
              textValue: condition.textValue,
            },
          },
        },
      });
      return upsertQuestionOfTrigger.triggerConditionId;
    }));

    await Promise.all(dbTriggerConditions.map(async (condition) => {
      if (!upsertedConditionsIds.includes(condition.id)) {
        await prisma.questionOfTrigger.deleteMany({ where: { triggerConditionId: condition.id } });
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
