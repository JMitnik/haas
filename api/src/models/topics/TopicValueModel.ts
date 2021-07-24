import { objectType } from "@nexus/schema";

export const TopicValueModel = objectType({
  name: 'TopicValueModel',

  definition(t) {
    t.id('id');
    t.string('label');
  }
});
