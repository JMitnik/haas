import { PrismaClient, TriggerCondition, TriggerUpdateArgs, TriggerUpdateInput, User, UserUpdateManyWithoutTriggersInput, UserWhereUniqueInput } from '@prisma/client';

const prisma = new PrismaClient();

class TriggerResolver {
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

  static updateConditions = async (dbTriggerConditions: Array<TriggerCondition>, newConditions: Array<TriggerCondition>, triggerId: string) => {
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
    // await prisma.trigger.update({
    //   where: {
    //     id: triggerId,
    //   },
    //   data: recipientUpdateArgs,
    // });
  };
}

export default TriggerResolver;
