import { objectType } from '@nexus/schema';
import { AutomationEventModel } from './AutomationEvent';
import { AutomationActionModel } from './AutomationAction'
import { AutomationConditionBuilderModel } from './AutomationConditionBuilder';

export const AutomationTriggerModel = objectType({
  name: 'AutomationTriggerModel',
  description: 'AutomationTrigger',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.string('dialogueSlug', {
      nullable: true,
      async resolve(parent, args, ctx) {
        if (parent.event?.dialogue?.slug) {
          return parent.event?.dialogue?.slug;
        }

        if (parent.event?.question?.id) {
          const dialogue = await ctx.services.dialogueService.findDialogueByQuestionId(
            parent.event?.question?.id
          );
          return dialogue?.slug || null;
        }

        return null;
      },
    })

    t.field('event', {
      type: AutomationEventModel,
      nullable: true,
    });

    t.field('conditionBuilder', {
      type: AutomationConditionBuilderModel,
      nullable: true,
    });

    t.list.field('actions', {
      type: AutomationActionModel,
      nullable: true,
    });
  },
});
