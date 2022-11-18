import { objectType } from 'nexus';
import { AuditEventType } from './AuditEventType.graphql';

export const AuditEvent = objectType({
  name: 'AuditEvent',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');

    t.nonNull.float('version');

    t.nullable.json('payload');

    t.nullable.field('user', {
      type: 'UserType',
    });

    t.nonNull.field('type', {
      type: AuditEventType,
    });
  },
})
