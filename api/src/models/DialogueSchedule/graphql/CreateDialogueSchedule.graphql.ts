import { inputObjectType, mutationField, objectType, nonNull } from 'nexus';

import { DialogueSchedule } from './DialogueSchedule.graphql';

export const CreateDataPeriodInput = inputObjectType({
  name: 'CreateDataPeriodInput',
  description: 'Input for creating a dialogue schedule.',

  definition(t) {
    t.nonNull.string('startDateExpression');
    t.nonNull.string('endDateExpression');
  },
});

export const CreateEvaluationPeriodInput = inputObjectType({
  name: 'CreateEvaluationPeriodInput',
  description: 'Input for creating a dialogue schedule.',

  definition(t) {
    t.nonNull.string('startDateExpression');
    t.string('endDateExpression');
  },
});

export const CreateDialogueScheduleInput = inputObjectType({
  name: 'CreateDialogueScheduleInput',
  description: 'Input for creating a dialogue schedule.',

  definition(t) {
    t.nonNull.string('workspaceId');
    t.nonNull.field('dataPeriod', { type: CreateDataPeriodInput });
    t.field('evaluationPeriod', { type: CreateEvaluationPeriodInput });
  },
});

export const CreateDialogueScheduleOutput = objectType({
  name: 'CreateDialogueScheduleOutput',
  description: 'Result of creating dialogue schedule',

  definition(t) {
    t.field('dialogueSchedule', { type: DialogueSchedule })
  },
});

export const CreateDialogueSchedule = mutationField('createDialogueSchedule', {
  type: CreateDialogueScheduleOutput,
  args: { input: nonNull(CreateDialogueScheduleInput) },
  description: 'Creates a dialogue schedule in the backend',

  resolve(parent, args, ctx) {
    // TODO: Validate input
    return ctx.services.dialogueScheduleService.create(args.input);
  },
})
