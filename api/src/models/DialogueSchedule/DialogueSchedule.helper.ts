import { DialogueScheduleFields } from './DialogueSchedule.types';
import { SchedulePeriod } from './SchedulePeriod.helper';

/**
 * The DialogueSchedule is a wrapper class.
 */
export class DialogueSchedule {
  constructor(public fields: DialogueScheduleFields) {}

  public get dataPeriodSchedule(): SchedulePeriod | undefined {
    if (!this.fields.dataPeriodSchedule) return undefined;

    const schedule = new SchedulePeriod(
      this.fields.dataPeriodSchedule?.startDateExpression,
      this.fields.dataPeriodSchedule?.endInDeltaMinutes,
    );

    return schedule;
  }

  /**
   * Calculates if `evaluation` of our dialogues according to this schedule is active.
   */
  public get evaluationIsActive(): boolean {
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

  /**
   * Serializes class to GraphQL.
   */
  public toGraphQL() {
    return {
      ...this.fields,
    }
  }
}
