import { objectType } from 'nexus';

export const Path = objectType({
  name: 'Path',
  description: 'A path is the traversal of topics in a dialogue.',

  definition(t) {
    t.id('id');
    t.list.string('topicStrings');
  },
})
