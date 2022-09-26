import {
  Prisma,
  Trigger,
  TriggerCondition as PrismaTriggerCondition,
  User,
  PrismaClient,
  Dialogue,
} from 'prisma/prisma-client';
import { isAfter, subSeconds } from 'date-fns';
import { isPresent } from 'ts-is-present';
import _ from 'lodash';

import { NexusGenInputs } from '../../generated/nexus';
import { FindManyCallBackProps, PaginateProps, paginate } from '../Common/Pagination/pagination';
import { SessionWithEntries } from '../session/Session.types';
import { mailService } from '../../services/mailings/MailService';
import { smsService } from '../../services/sms/SmsService';
import NodeEntryService from '../node-entry/NodeEntryService';
import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';
import makeTriggerMailTemplate from '../../services/mailings/templates/makeTriggerMailTemplate';
import prisma from '../../config/prisma';
import TriggerPrismaAdapter from './TriggerPrismaAdapter';
import { CreateQuestionOfTriggerInput, CreateTriggerInput, TriggerWithSendData, TriggerCondition } from './TriggerServiceType';

class TriggerService {
  triggerPrismaAdapter: TriggerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.triggerPrismaAdapter = new TriggerPrismaAdapter(prismaClient);
  };

  /**
   * Gets all triggers for one workspace.
   * */
  getTriggersByCustomerSlug(customerSlug: string) {
    return this.triggerPrismaAdapter.getTriggersByCustomerSlug(customerSlug);
  };

  /**
   * Gets all triggers for one user.
   * */
  getTriggersByUserId(userId: string) {
    return this.triggerPrismaAdapter.getTriggersByUserId(userId);
  };

  /**
   * Finds one trigger by trigger-id.
   * */
  findTriggerById(triggerId: string): Promise<Trigger | null> {
    return this.triggerPrismaAdapter.getById(triggerId);
  };

  /**
   * Creates a trigger based on input and conditions.
   * */
  async createTrigger(createTriggerInput: CreateTriggerInput, conditions: TriggerCondition[]): Promise<Trigger> {
    const trigger = await this.triggerPrismaAdapter.create(createTriggerInput);

    conditions?.forEach(async (condition) => await this.triggerPrismaAdapter.createQuestionOfTrigger({
      triggerId: trigger.id,
      condition,
    }));

    return trigger;
  };

  /**
   * Edits an existing trigger based on input, potential recipients, and conditions.
   * */
  async editTrigger(triggerId: string, updateTriggerInput: Prisma.TriggerUpdateInput, recipientIds: string[], conditions: Array<NexusGenInputs['TriggerConditionInputType']>) {
    let updateTriggerArgs = updateTriggerInput;
    const dbTrigger = await this.triggerPrismaAdapter.getById(triggerId);

    if (!dbTrigger) throw new Error('Unable to find trigger with given ID');

    if (dbTrigger?.recipients) {
      updateTriggerArgs = TriggerService.updateRecipients(
        dbTrigger.recipients, (recipientIds || []), updateTriggerInput,
      );
    };

    if (dbTrigger?.conditions) {
      await this.updateConditions(dbTrigger.conditions, conditions, dbTrigger.id);
    };

    return this.triggerPrismaAdapter.update(dbTrigger?.id, updateTriggerArgs);
  };

  /**
   * Deletes a trigger.
   * */
  async deleteTrigger(triggerId: string) {
    await this.triggerPrismaAdapter.deleteQuestionsByTriggerId(triggerId);
    await this.triggerPrismaAdapter.deleteConditionsByTriggerId(triggerId);

    return this.triggerPrismaAdapter.delete(triggerId);
  };

  /**
   * Get all conditions belonging to a trigger.
   * */
  getConditionsOfTrigger(triggerId: string): Promise<PrismaTriggerCondition[]> {
    return this.triggerPrismaAdapter.getConditionsByTriggerId(triggerId);
  };

  /**
   * Find the one dialogue belonging to a trigger.
   * */
  findDialogueOfTrigger(triggerId: string): Promise<Dialogue | null> {
    return this.triggerPrismaAdapter.getDialogueByTriggerId(triggerId);
  };

  /**
   * Find the question belonging to a trigger and trigger condition.
   * */
  getQuestionOfTrigger(triggerId: string, triggerConditionId: number) {
    return this.triggerPrismaAdapter.getQuestionByTriggerProps(triggerId, triggerConditionId);
  };

  static getSearchTermFilter = (searchTerm: string) => {
    if (!searchTerm) {
      return [];
    };

    const searchTermFilter: Prisma.TriggerWhereInput[] = [
      { name: { contains: searchTerm } },
    ];

    return searchTermFilter;
  };

  static paginatedTriggers = async (
    customerSlug: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const findManyTriggerArgs: Prisma.TriggerFindManyArgs = { where: { customer: { slug: customerSlug } } };

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

  /**
   * Send trigger mail.
   * */
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
  };

  /**
   * Send trigger over SMS.
   * */
  static sendSmsTrigger(
    trigger: TriggerWithSendData,
    recipient: User, session: SessionWithEntries,
    values: Array<{ value: string | number | undefined; type: string }>,
  ) {
    if (!recipient.phone) return;

    const mappedValues = values.map((value) => `${value.type} -> ${value.value}`);
    const joinedValues = mappedValues.join(', ');

    smsService.send(recipient.phone, `HAAS: Your Alert "${trigger.name}" was triggered because of the following condition(s): ${joinedValues}`);
  };


  /**
   * Send trigger, either via SMS or via Mail.
   * */
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
    };
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
  };

  findTriggersByQuestionIds = async (questionIds: Array<string>) => {
    return this.triggerPrismaAdapter.findTriggersByQuestionIds(questionIds);
  };

  static matchMulti(triggerTargets: {
    condition: PrismaTriggerCondition;
    nodeEntry: NodeEntryWithTypes | undefined;
  }[]) {
    const matchResults = triggerTargets.map((triggerTarget) => triggerTarget.nodeEntry && TriggerService.match(triggerTarget.condition, triggerTarget.nodeEntry));
    return matchResults;
  };

  static match(triggerCondition: PrismaTriggerCondition, entry: NodeEntryWithTypes) {
    let conditionMatched;

    switch (triggerCondition.type) {
      case 'HIGH_THRESHOLD': {
        conditionMatched = { isMatch: false };

        if (!entry.sliderNodeEntry?.value || !triggerCondition?.maxValue) {
          break;
        };

        if (entry.sliderNodeEntry?.value > triggerCondition.maxValue) {
          conditionMatched = { isMatch: true, value: entry.sliderNodeEntry?.value, conditionType: triggerCondition.type };
        };

        break;
      };

      case 'LOW_THRESHOLD': {
        conditionMatched = { isMatch: false };

        if (!entry.sliderNodeEntry?.value || !triggerCondition?.minValue) {
          break;
        };

        if (entry.sliderNodeEntry?.value < triggerCondition.minValue) {
          conditionMatched = { isMatch: true, value: entry.sliderNodeEntry?.value, conditionType: triggerCondition.type };
        };

        break;
      };

      case 'TEXT_MATCH': {
        conditionMatched = { isMatch: false };
        const textEntry = NodeEntryService.getTextValueFromEntry(entry);

        if (!textEntry || !triggerCondition?.textValue) {
          break;
        };

        if (textEntry === triggerCondition.textValue) {
          conditionMatched = { isMatch: true, value: textEntry, conditionType: triggerCondition.type };
        };

        break;
      };

      case 'INNER_RANGE': {
        conditionMatched = { isMatch: false };

        const score = entry.sliderNodeEntry?.value;

        if (!score || !triggerCondition.maxValue || !triggerCondition.minValue) {
          break;
        };

        if (score <= triggerCondition.maxValue && score >= triggerCondition.minValue) {
          conditionMatched = {
            isMatch: true,
            value: score,
            conditionType: triggerCondition.type,
          };
        };

        break;
      };

      case 'OUTER_RANGE': {
        conditionMatched = { isMatch: false };
        const score = entry.sliderNodeEntry?.value;

        if (!score || !triggerCondition.maxValue || !triggerCondition.minValue) {
          break;
        };

        if (score > triggerCondition.maxValue || score < triggerCondition.minValue) {
          conditionMatched = {
            isMatch: true,
            value: score,
            conditionType: triggerCondition.type,
          };
        };

        break;
      };

      default:
        conditionMatched = { isMatch: false };
    };

    return conditionMatched;
  }

  static updateRelatedQuestion = (
    dbTriggerRelatedNodeId: string | null | undefined,
    newRelatedNodeId: string | null | undefined,
    updateTriggerArgs: Prisma.TriggerUpdateInput,
  ): Prisma.TriggerUpdateInput => {
    if (newRelatedNodeId && newRelatedNodeId !== dbTriggerRelatedNodeId) {
      updateTriggerArgs.relatedNode = { connect: { id: newRelatedNodeId } };
    } else if (!newRelatedNodeId) {
      updateTriggerArgs.relatedNode = { disconnect: true };
    }

    return updateTriggerArgs;
  };

  updateConditions = async (
    dbTriggerConditions: Array<PrismaTriggerCondition>,
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
        await this.triggerPrismaAdapter.deleteQuestionsByTriggerConditionId(condition.id);
        return this.triggerPrismaAdapter.deleteConditionById(condition.id);
      }

      return null;
    }));
  };

  static updateRecipients = (
    dbTriggerRecipients: Array<User>,
    newRecipients: Array<string>,
    updateTriggerArgs: Prisma.TriggerUpdateInput,
  ): Prisma.TriggerUpdateInput => {
    const newRecipientObjects = newRecipients.map((recipientId) => ({ id: recipientId }));

    const deleteRecipientObjects: Prisma.UserWhereUniqueInput[] = [];
    dbTriggerRecipients.forEach((recipient) => {
      if (!newRecipients.includes(recipient.id)) {
        deleteRecipientObjects.push({ id: recipient.id });
      }
    });

    const recipientUpdateArgs: any = {};
    if (newRecipientObjects.length > 0) {
      recipientUpdateArgs.connect = newRecipientObjects;
    };

    if (deleteRecipientObjects.length > 0) {
      recipientUpdateArgs.disconnect = deleteRecipientObjects;
    };

    updateTriggerArgs.recipients = recipientUpdateArgs;
    return updateTriggerArgs;
  };
};

export default TriggerService;
