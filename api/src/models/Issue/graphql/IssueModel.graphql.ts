import { objectType } from 'nexus';
import { Topic } from '../../Topic/graphql';
import { ActionableType } from '../../actionable/graphql/Actionable.graphql';

export const IssueModel = objectType({
  name: 'IssueModel',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');
    t.string('topicId');


    t.list.field('actionables', {
      type: ActionableType,
    });

    t.field('topic', {
      type: Topic,
    });


  },
})