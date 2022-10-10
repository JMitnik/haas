import { DialogueScheduleFields } from './DialogueSchedule.types';
import { SchedulePeriod } from './SchedulePeriod.helper';

/**
 * The DialogueSchedule is a wrapper class.
 */
export class DialogueSchedule {
  constructor(public fields: DialogueScheduleFields) {}

  public get enabledEvaluation(): boolean {
    // If the schedule is disabled, we always enable evaluation.
    if (!this.fields.isEnabled) return true;

    // If there is no evaluation period, we also enable evaluation
    if (!this.fields.evaluationPeriodSchedule) return true;

    const schedule = new SchedulePeriod(
      this.fields.evaluationPeriodSchedule.startDateExpression,
      this.fields.evaluationPeriodSchedule.endInDeltaMinutes,
    );

    return schedule.isActive;
  }

  public toGraphQL() {
    return {
      ...this.fields,
    }
  }
}
