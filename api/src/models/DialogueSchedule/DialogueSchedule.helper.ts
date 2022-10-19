import { constructCreateAutomationInput } from '../automations/AutomationService.helpers';
import { CreateAutomationInput } from '../automations/AutomationTypes';
import { AutomationEventType, AutomationType, Prisma } from 'prisma/prisma-client';
import { assertNonNullish } from '../../utils/assertNonNullish';
import { Cron } from './Cron.helper';
import { DialogueScheduleFields } from './DialogueSchedule.types';
import { SchedulePeriod } from './SchedulePeriod.helper';

/**
 * The DialogueSchedule is a wrapper class.
 */
export class DialogueSchedule {
  public dataPeriodSchedule: SchedulePeriod | undefined;
  public evalPeriodSchedule: SchedulePeriod | undefined;

  constructor(public fields: DialogueScheduleFields) {
    this.dataPeriodSchedule = this.makeDataPeriodSchedule();
    this.evalPeriodSchedule = this.makeEvalPeriodSchedule();
  }

  /**
   * Calculates if `evaluation` of our dialogues according to this schedule is active.
   */
  public get evaluationIsActive(): boolean {
    if (!this.fields.isEnabled) return true;

    if (this.evalPeriodSchedule?.isActive === undefined) return true;
    return this.evalPeriodSchedule?.isActive;
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
