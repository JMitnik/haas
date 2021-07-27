import {
  FindManyTriggerArgs,
  Trigger,
  TriggerCondition,
  TriggerUpdateInput,
  TriggerWhereInput,
  User,
  UserWhereUniqueInput,
  PrismaClient,
  Dialogue,
  TriggerMedium,
  TriggerEnum,
} from '@prisma/client';
import { isAfter, subSeconds } from 'date-fns';
import { isPresent } from 'ts-is-present';
import _ from 'lodash';

// eslint-disable-next-line import/no-cycle
import { NexusGenInputs } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import { CustomerWithCustomerSettings } from '../customer/Customer';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { SessionWithEntries } from '../session/SessionTypes';
import { mailService } from '../../services/mailings/MailService';

import { smsService } from '../../services/sms/SmsService';
import NodeEntryService from '../node-entry/NodeEntryService';
import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';
import makeTriggerMailTemplate from '../../services/mailings/templates/makeTriggerMailTemplate';
import prisma from '../../config/prisma';
import TriggerPrismaAdapter from './adapters/Trigger/TriggerPrismaAdapter';
import QuestionOfTriggerPrismaAdapter from './adapters/QuestionOfTrigger/QuestionOfTriggerPrismaAdapter';
import { CreateQuestionOfTriggerInput } from './adapters/QuestionOfTrigger/QuestionOfTriggerPrismaAdapterType';
import TriggerConditionPrismaAdapter from './adapters/TriggerCondition/TriggerConditionPrismaAdapter';
import { CreateTriggerInput, TriggerWithSendData } from './TriggerServiceType';

class TriggerService {
  triggerPrismaAdapter: TriggerPrismaAdapter;
  questionOfTriggerPrismaAdapter: QuestionOfTriggerPrismaAdapter;
  triggerConditionPrismaAdapter: TriggerConditionPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.triggerPrismaAdapter = new TriggerPrismaAdapter(prismaClient);
    this.questionOfTriggerPrismaAdapter = new QuestionOfTriggerPrismaAdapter(prismaClient);
    this.triggerConditionPrismaAdapter = new TriggerConditionPrismaAdapter(prismaClient);
  };

  getTriggerById(triggerId: string): Promise<Trigger | null> {
    return this.triggerPrismaAdapter.getById(triggerId);
  }

  async createTrigger(triggerCreateArgs: CreateTriggerInput, conditions: { id?: number | null | undefined; maxValue?: number | null | undefined; minValue?: number | null | undefined; questionId?: string | null | undefined; textValue?: string | null | undefined; type?: "LOW_THRESHOLD" | "HIGH_THRESHOLD" | "INNER_RANGE" | "OUTER_RANGE" | "TEXT_MATCH" | null | undefined; }[]): Promise<Trigger> {
    const trigger = await this.triggerPrismaAdapter.create(triggerCreateArgs);

    conditions?.forEach(async (condition) => await this.questionOfTriggerPrismaAdapter.createQuestionOfTrigger({
      triggerId: trigger.id,
      condition,
    }));

    return trigger;
  };

  async editTrigger(triggerId: string, triggerUpdateInput: TriggerUpdateInput, recipientIds: string[], conditions: Array<NexusGenInputs['TriggerConditionInputType']>) {
    let updateTriggerArgs = triggerUpdateInput;
    const dbTrigger = await this.triggerPrismaAdapter.getById(triggerId);

    if (!dbTrigger) throw new Error('Unable to find trigger with given ID');

    if (dbTrigger?.recipients) {
      updateTriggerArgs = TriggerService.updateRecipients(
        dbTrigger.recipients, (recipientIds || []), triggerUpdateInput,
      );
    };

    if (dbTrigger?.conditions) {
      await this.updateConditions(dbTrigger.conditions, conditions, dbTrigger.id);
    };

    return this.triggerPrismaAdapter.update(dbTrigger?.id, updateTriggerArgs);
  };

  async deleteTrigger(triggerId: string) {
    await this.questionOfTriggerPrismaAdapter.deleteManyByTriggerId(triggerId);
    await this.triggerConditionPrismaAdapter.deleteManyByTriggerId(triggerId);
    return this.triggerPrismaAdapter.delete(triggerId);
  };

  getConditionsOfTrigger(triggerId: string): Promise<TriggerCondition[]> {
    return this.triggerConditionPrismaAdapter.getConditionsByTriggerId(triggerId);
  };

  getDialogueOfTrigger(triggerId: string): Promise<Dialogue | null> {
    return this.questionOfTriggerPrismaAdapter.findDialogueByTriggerId(triggerId);
  };

  getQuestionOfTrigger(triggerId: string, triggerConditionId: number) {
    return this.questionOfTriggerPrismaAdapter.findOneQuestion(triggerId, triggerConditionId);
  };

  static getSearchTermFilter = (searchTerm: string) => {
    if (!searchTerm) {
      return [];
    };

    const searchTermFilter: TriggerWhereInput[] = [
      { name: { contains: searchTerm } },
    ];

    return searchTermFilter;
  };

  static paginatedTriggers = async (
    customerSlug: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const findManyTriggerArgs: FindManyTriggerArgs = { where: { customer: { slug: customerSlug } } };

    const findManyTriggers = async (
      { props: findManyArgs }: FindManyCallBackProps,
    ) => prisma.trigger.findMany(findManyArgs);
    const countTriggers = async ({ props: countArgs }: FindManyCallBackProps) => prisma.trigger.count(countArgs);

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: findManyTriggerArgs,
        searchFields: ['name'],
        orderFields: ['medium', 'type', 'name'],
        findManyCallBack: findManyTriggers,
      },
      countArgs: {
        countWhereInput: findManyTriggerArgs,
        countCallBack: countTriggers,
      },
      paginationOpts,
    };

    return paginate(paginateProps);
  };

  static sendMailTrigger(trigger: TriggerWithSendData, recipient: User, session: SessionWithEntries) {
    const triggerBody = makeTriggerMailTemplate(
      recipient.firstName || 'User',
      session, trigger?.customer?.settings?.colourSettings?.primary,
    );

    mailService.send({
      body: triggerBody,
      recipient: recipient.email,
      subject: 'A HAAS alert has been triggered',
    });
  }

  static sendSmsTrigger(
    trigger: TriggerWithSendData,
    recipient: User, session: SessionWithEntries,
    values: Array<{ value: string | number | undefined, type: string }>,
  ) {
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
  };

  async tryTrigger(session: SessionWithEntries, trigger: TriggerWithSendData) {
    const currentDate = new Date();
    const safeToSend = !trigger.lastSent || isAfter(subSeconds(currentDate, 5), trigger.lastSent);

    // TODO-LATER: Put this part into a queue
    if (!safeToSend) return;

    await this.triggerPrismaAdapter.updateLastSent(trigger.id, currentDate);

    const questionsOfTrigger = await this.triggerPrismaAdapter.getQuestionsOfTriggerById(trigger.id);

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

  tryTriggers = async (session: SessionWithEntries) => {
    const questionIds = session.nodeEntries?.map((entry) => entry.relatedNodeId).filter(isPresent);
    const dialogueTriggers = await this.findTriggersByQuestionIds(questionIds);

    dialogueTriggers.forEach(async (trigger) => {
      await this.tryTrigger(session, trigger);
    });
  };

  findTriggersByDialogueId = async (dialogueId: string) => {
    return this.triggerPrismaAdapter.findTriggersByDialogueId(dialogueId);
  }

  findTriggersByQuestionIds = async (questionIds: Array<string>) => {
    return this.triggerPrismaAdapter.findTriggersByQuestionIds(questionIds);
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

        if (score <= triggerCondition.maxValue && score >= triggerCondition.minValue) {
          conditionMatched = {
            isMatch: true,
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

        if (score > triggerCondition.maxValue || score < triggerCondition.minValue) {
          conditionMatched = {
            isMatch: true,
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

  updateConditions = async (
    dbTriggerConditions: Array<TriggerCondition>,
    newConditions: Array<NexusGenInputs['TriggerConditionInputType']>,
    triggerId: string,
  ) => {
    const upsertedConditionsIds = await Promise.all(newConditions.map(async (condition) => {
      const upsertInput: CreateQuestionOfTriggerInput = { condition, triggerId };

      const upsertQuestionOfTrigger = await this.triggerPrismaAdapter.upsertQuestionOfTrigger(upsertInput);

      return upsertQuestionOfTrigger.triggerConditionId;
    }));

    await Promise.all(dbTriggerConditions.map(async (condition) => {
      if (!upsertedConditionsIds.includes(condition.id)) {
        await this.questionOfTriggerPrismaAdapter.deleteManyByTriggerConditionId(condition.id);
        return this.triggerConditionPrismaAdapter.deleteById(condition.id);
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
