import { objectType } from 'nexus';
import { AutomationEventModel } from './AutomationEvent';
import { AutomationActionModel } from './AutomationAction'
import { AutomationConditionBuilderModel } from './AutomationConditionBuilder';
import { DialogueType } from '../../questionnaire/Dialogue';

export const AutomationTriggerModel = objectType({
  name: 'AutomationTriggerModel',
  description: 'AutomationTrigger',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('activeDialogue', {
      type: DialogueType,
      nullable: true,
      async resolve(parent, args, ctx) {
        if (parent.event?.dialogue?.slug) {
          return parent.event?.dialogue;
        }

        if (parent.event?.question?.id) {
          const dialogue = await ctx.services.dialogueService.findDialogueByQuestionId(
            parent.event?.question?.id
          );
          return dialogue || null;
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

    });

    t.list.field('actions', {
      type: AutomationActionModel,
      nullable: true,
    });
  },
});
