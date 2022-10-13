import { DialogueScheduleFields } from './DialogueSchedule.types';
import { SchedulePeriod } from './SchedulePeriod.helper';

/**
 * The DialogueSchedule is a wrapper class.
 */
export class DialogueSchedule {
  private dataPeriodSchedule: SchedulePeriod | undefined;
  private evalPeriodSchedule: SchedulePeriod | undefined;

  constructor(public fields: DialogueScheduleFields) {
    this.dataPeriodSchedule = this.makeDataPeriodSchedule();
    this.evalPeriodSchedule = this.makeEvalPeriodSchedule();
  }

  /**
   * Calculates if `evaluation` of our dialogues according to this schedule is active.
   */
  public get evaluationIsActive(): boolean {
    return this.evalPeriodSchedule?.isActive || true;
  }

  /**
   * Serializes class to GraphQL.
   */
  public toGraphQL() {
    return {
      ...this.fields,
      dataPeriodSchedule: {
        ...this.fields.dataPeriodSchedule,
        ...this.dataPeriodSchedule?.toGraphQL(),
      },
      evaluationPeriodSchedule: {
        ...this.fields.evaluationPeriodSchedule,
        ...this.evalPeriodSchedule?.toGraphQL(),
      },
    }
  }

  private makeDataPeriodSchedule(): SchedulePeriod | undefined {
    if (!this.fields.dataPeriodSchedule) return undefined;

    const schedule = new SchedulePeriod(
      this.fields.dataPeriodSchedule?.startDateExpression,
      this.fields.dataPeriodSchedule?.endInDeltaMinutes,
    );

    return schedule;
  }

  private makeEvalPeriodSchedule(): SchedulePeriod | undefined {
    // If there is no evaluation period, we also enable evaluation
    if (!this.fields.evaluationPeriodSchedule) return undefined;

    const schedule = new SchedulePeriod(
      this.fields.evaluationPeriodSchedule.startDateExpression,
      this.fields.evaluationPeriodSchedule.endInDeltaMinutes,
    );

    return schedule;
  }
}
