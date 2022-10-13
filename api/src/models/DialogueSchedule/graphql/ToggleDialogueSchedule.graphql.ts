import { inputObjectType, mutationField, nonNull } from 'nexus';

import { DialogueSchedule } from './DialogueSchedule.graphql';

export const ToggleDialogueScheduleInput = inputObjectType({
  name: 'ToggleDialogueScheduleInput',
  description: 'Toggle status of dialogue schedule',

  definition(t) {
    t.nonNull.id('dialogueScheduleId');
    t.nonNull.boolean('status');
  },
});

export const ToggleDialogueSchedule = mutationField('toggleDialogueSchedule', {
  type: DialogueSchedule,
  args: { input: nonNull(ToggleDialogueScheduleInput) },
  description: 'Creates a dialogue schedule in the backend',

  resolve(parent, args, ctx) {
    // TODO: Validate input
    return ctx.services.dialogueScheduleService.toggleStatus(args.input.dialogueScheduleId, args.input.status);
  },
})
