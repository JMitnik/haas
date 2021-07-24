import { extendType } from "@nexus/schema";

import { TopicModel } from "./TopicModel";
import { TopicValueModel } from "./TopicValueModel";

/**
 * Access pattern for accessing all topic values belonging to a topic.
 */
export const GetTopicValuesOfTopic = extendType({
  type: 'TopicModel',

  definition(t) {
    t.list.field('topicValues', {
      type: TopicValueModel,

      async resolve(parent, args, ctx) {
        // Check if we already looked up the topic-values.
        if (parent.topicValues) return parent.topicValues;

        // Go to the database with a particular topic-value, and get all topic-values.

        // Go to the database with a particular dialogue-id
        // From the database, get all topics
        const parentTopicId = parent.id;
        const topicWithValues = await ctx.prisma.topic.findOne({
          where: { id: parentTopicId },
          include: {
            values: true,
          }
        });

        // Give them to me.
        return topicWithValues?.values;
      }
    })
  },
});
