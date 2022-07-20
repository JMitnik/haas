import { objectType } from '@nexus/schema';
import { AutomationActionChannelType } from './AutomationActionChannelType';

export const AutomationActionChannel = objectType({
  name: 'AutomationActionChannel',
  description: 'AutomationActionChannel',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', {
      type: AutomationActionChannelType,
    });

    t.json('payload', { nullable: true });
  },
});