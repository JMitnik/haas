import { objectType } from 'nexus';

import { ActionableState } from './ActionableState.graphql';
import { UserType } from '../../users/graphql/User';
import { DialogueType } from '../../questionnaire/Dialogue'
import { IssueModel } from '../../Issue/graphql/IssueModel.graphql';
import { SessionType } from '../../session/graphql';

export const ActionableType = objectType({
  name: 'Actionable',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.string('dialogueId');
    t.string('assigneeId');
    t.string('issueId');
    t.string('requestEmail', {
      resolve(parent: any) {
        return parent.requestEmail
      },
    });
    t.nonNull.boolean('isVerified');

    t.nonNull.field('status', {
      type: ActionableState,
    });

    t.field('assignee', {
      type: UserType,
    });

    t.field('dialogue', {
      type: DialogueType,
    });

    t.field('issue', {
      type: IssueModel,
    });

    t.field('session', {
      type: SessionType,
    });

  },
})