import { Prisma } from 'prisma/prisma-client';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

export type CreateDialogueScheduleInput = NexusGenInputs['CreateDialogueScheduleInput'];
export type ToggleDialogueScheduleInput = NexusGenInputs['ToggleDialogueScheduleInput'];
export type CreateDialogueScheduleOutput = NexusGenFieldTypes['CreateDialogueScheduleOutput'];

export const defaultDialogueSchedule = Prisma.validator<Prisma.DialogueScheduleArgs>()({
  include: {
    dataPeriodSchedule: true,
    evaluationPeriodSchedule: true,
  },
});

export type DialogueScheduleFields = Prisma.DialogueScheduleGetPayload<typeof defaultDialogueSchedule>;
