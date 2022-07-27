import { objectType } from 'nexus';

import { AutomationActionChannel } from './AutomationActionChannel';
import { AutomationActionType } from './AutomationActionType';

export const AutomationActionModel = objectType({
  name: 'AutomationActionModel',
  description: 'AutomationAction',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', {
      type: AutomationActionType,
    });

    t.list.field('channels', {
      type: AutomationActionChannel,
      nullable: true,
      resolve: async (parent: any, _, ctx) => {
        if (parent.channels) {
          return parent.channels;
        }

        if (!parent.id) return [];

        const result = await ctx.services.automationActionService.findChannelsByActionId(parent.id);
        return result;
      },
    })

    t.json('payload', { nullable: true });
  },
});