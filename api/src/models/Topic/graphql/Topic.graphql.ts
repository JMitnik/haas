import { objectType } from 'nexus';
import { CustomerType } from '../../customer'
import { QuestionOptionType } from '../../QuestionNode/QuestionNode';

export const Topic = objectType({
  name: 'Topic',
  description: 'Model for topic',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.nonNull.string('type');

    t.list.field('subTopics', {
      type: Topic,
    });

    t.list.field('parentTopics', {
      type: Topic,
    });

    t.nullable.field('workspace', {
      type: CustomerType,
    });

    t.list.field('usedByOptions', {
      type: QuestionOptionType,
    });
  },
})