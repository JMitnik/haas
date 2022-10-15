import { parseExpression } from 'cron-parser';
import { add } from 'date-fns'

/**
 * The SchedulePeriod helper class wraps around a schedule expression (CRON-like + delta),
 * and returns the active date, active end date, and relevant meta data such as whether
 * it is active or not.
 */
export class SchedulePeriod {
  private startDateExpression: string;
  private endDeltaInMinutes: number;
  public activeStartDate: Date;
  public activeEndDate: Date;

  constructor(startDateExpression: string, endDeltaInMinutes: number) {
    this.startDateExpression = startDateExpression;
    this.endDeltaInMinutes = endDeltaInMinutes;

    this.activeStartDate = this.parseActiveStartDate(startDateExpression);
    this.activeEndDate = this.parseEndDate(this.activeStartDate, endDeltaInMinutes);
  }

  public get isActive(): boolean {
    const current = new Date(Date.now());

    return this.activeStartDate < current && this.activeEndDate > current;
  }

  public toGraphQL() {
    return {
      isActive: this.isActive,
      activeStartDate: this.activeStartDate,
      activeEndDate: this.activeEndDate,
    }
  }

  private parseNextStartDate(expression: string) {
    return parseExpression(expression).iterate(1)[0].toDate();
  }

  /**
   * Parses a start date by always looking backwards.
   * This means, the startDate will never be interpreted based on the future dates.
   */
  private parseActiveStartDate(expression: string) {
    return parseExpression(expression).prev().toDate();
  }

  /**
   * Parses an end date by adding `delta minutes` to the start date.
   */
  private parseEndDate(startDate: Date, endDeltaInMinutes: number) {
    return add(startDate, { minutes: endDeltaInMinutes });
  }
}
