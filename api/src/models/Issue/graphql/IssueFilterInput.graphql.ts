import { inputObjectType } from '@nexus/schema';

export const IssueFilterInput = inputObjectType({
  name: 'IssueFilterInput',
  description: 'Filter input for Issues',

  definition(t) {
    t.string('startDate');
    t.string('endDate');

    /** Fragments of the dialogue which should constitute the relevant filter */
    t.list.string('dialogueStrings');

    /** Fragments of the topic which should constitute the relevant filter */
    t.list.string('topicStrings');
  },
});
