import { inputObjectType } from '@nexus/schema';

export const TopicFilterInput = inputObjectType({
  name: 'TopicFilterInput',
  description: 'Generic filter object for filtering topics',

  definition(t) {
    /** Topics as strings used for filtering */
    t.list.string('topicStrings', { required: false });

    /** Threshold and only fetch topics where scores meet a certain threshold. */
    t.float('relatedSessionScoreLowerThreshold', { required: false });

    /** Fragments of dialouge */
    t.list.string('dialogueStrings', { required: false });
  },
})
