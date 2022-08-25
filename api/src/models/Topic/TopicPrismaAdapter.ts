import { Prisma, PrismaClient, TopicType } from '@prisma/client';
import { isPresent } from 'ts-is-present';

import { CreateTopicInput } from './Topic.types';

export class TopicPrismaAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public createTopicInput(input: CreateTopicInput): Prisma.TopicCreateInput {
    const createSubTopicsInput = input.subTopics?.map((subTopic) => ({
      create: {
        name: subTopic?.name as string,
        type: subTopic?.type as TopicType || undefined,
      },
      where: {
        name: subTopic?.name as string,
      },
    })).filter(isPresent) || undefined;

    return {
      name: input.name,
      type: input.type as TopicType || undefined,
      subTopics: {
        connectOrCreate: createSubTopicsInput,
      },
    }
  }

  /**
   * Create a topic and its sub topics (Max 1 layer deep)
   * @param input 
   * @returns 
   */
  public async createTopics(input: CreateTopicInput) {
    const createTopicInput = this.createTopicInput(input);
    return this.prisma.topic.upsert({
      where: {
        name: input.name,
      },
      create: createTopicInput,
      update: createTopicInput,
    })
  }


}
