import { extendType, objectType } from "@nexus/schema";
import { TopicValueModel } from "./TopicValueModel";

export const TopicModel = objectType({
  name: 'TopicModel',

  definition(t) {
    t.id('id');
    t.string('label');
    t.list.field('topicValues', {
      type: TopicValueModel,
      // @ts-ignore
      resolve: (parent) => parent.topicValues
    });
  }
});

/**
 * Access pattern for accessing all topics belonging to a workspace.
 */
 export const GetTopicsOfWorkspace = extendType({
  type: 'Dialogue',

  definition(t) {
    t.list.field('topics', {
      type: TopicModel,

      async resolve(parent, args, ctx) {
        const dialogue = await ctx.services.dialogueService.findDialogueById(parent.id);
        return dialogue?.topics || [];
      }
    })
  },
});
