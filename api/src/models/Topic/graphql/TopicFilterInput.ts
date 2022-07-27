import { inputObjectType } from 'nexus';

export const TopicFilterInput = inputObjectType({
  name: 'TopicFilterInput',
  description: 'Generic filter object for filtering topics',

  definition(t) {
    /** Topics as strings used for filtering */
    t.list.nonNull.string('topicStrings', { required: false });

    /** Threshold and only fetch topics where scores meet a certain threshold. */
    t.float('relatedSessionScoreLowerThreshold', { required: false });

    /** Fragments of dialouge */
    t.list.nonNull.string('dialogueStrings', { required: false });
  },
})
