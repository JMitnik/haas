import { extendType, objectType } from "@nexus/schema";

export const TopicModel = objectType({
  name: 'TopicModel',

  definition(t) {
    t.id('id');
    t.string('label');
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
        // Go to the database with a particular dialogue-id
        // From the database, get all topics
        const which_DialogueID_DoWeWant_AllTopics_From = parent.id;
        const dialogueWithTopics = await ctx.prisma.dialogue.findOne({
          where: { id: which_DialogueID_DoWeWant_AllTopics_From },
          include: {
            topics: true
          }
        });

        // Give them to me.
        return dialogueWithTopics?.topics;
      }
    })
  },
});