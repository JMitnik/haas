import { DialogueSchedule } from '../../DialogueSchedule/DialogueSchedule.helper';

export class AnalyticsFilter {
  constructor(public startDate: Date, public endDate?: Date) {}

  /**
   * Override the current startDate and endDate with that of an DialogueSchedule.
   */
  public withSchedule(dialogueSchedule: DialogueSchedule) {
    if (!dialogueSchedule.fields.isEnabled) return;

    const dataPeriodSchedule = dialogueSchedule.dataPeriodSchedule;
    if (!dataPeriodSchedule) return;

    this.startDate = dataPeriodSchedule.activeStartDate;
    this.endDate = dataPeriodSchedule.activeEndDate;
  }
}
