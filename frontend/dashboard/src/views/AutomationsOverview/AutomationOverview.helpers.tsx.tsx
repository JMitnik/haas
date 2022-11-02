import { CreateDialogueScheduleInput, DialogueSchedule } from 'types/generated-types';

/**
 * Convert a DialogueSchedule object to a declarative `CreateDialogueScheduleInput`.
 * - This describes how to "change" a Dialogue Schedule in the API, and can be overriden to
 * declare a new state.
 */
export const declareDialogueSchedule = (
  dialogueSchedule: DialogueSchedule,
  workspaceId: string,
): CreateDialogueScheduleInput => ({
  workspaceId,
  enable: dialogueSchedule.isEnabled,
  evaluationPeriod: {
    startDateExpression: dialogueSchedule.dataPeriodSchedule?.startDateExpression || '',
    endInDeltaMinutes: dialogueSchedule.dataPeriodSchedule?.endInDeltaMinutes || -1,
  },
  dataPeriod: {
    startDateExpression: dialogueSchedule.dataPeriodSchedule?.startDateExpression || '',
    endInDeltaMinutes: dialogueSchedule.dataPeriodSchedule?.endInDeltaMinutes || -1,
  },
});
