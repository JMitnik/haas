import { GraphQLYogaError } from '@graphql-yoga/node';

export interface SplitCron {
  minutes: string;
  hours: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export class Cron {
  public splitCron: SplitCron;

  constructor(public cron: string) {
    this.splitCron = this.toSplitted();
  }

  /** Converts an ordinary CRON string into an AWS ready CRON string */
  public toAWSCronString() {
    const { minutes, hours, dayOfMonth, dayOfWeek, month } = this.splitCron;

    // Transform the CRON expression to one supported by AWS (? indicator is not part of cron-validator)
    const scheduledExpression = `cron(${minutes} ${hours} ${dayOfMonth === '*' ? '?' : dayOfMonth} ${month} ${dayOfMonth === '1' ? '?' : dayOfWeek} *)`
    return scheduledExpression;
  }

  /**
   * Converts the dayOfWeek substring (range) from numerical representation of days to text representation
   * @returns A Cron object but with text representation of days instead of numerical representation
   */
  public convertDayOfWeek(): SplitCron {
    const splitted = this.splitCron.dayOfWeek.split('-');
    if (splitted.length > 1) {
      const startDay = this.toDayOfWeek(splitted[0]);
      const endDay = this.toDayOfWeek(splitted[1]);
      return { ...this.splitCron, dayOfWeek: `${startDay}-${endDay}` }
    }
    return { ...this.splitCron, dayOfWeek: this.toDayOfWeek(this.splitCron.dayOfWeek) };
  }

  /**
   * Splits up a cron string into its separate parts
   * @returns 
   */
  private toSplitted(): SplitCron {
    const splitCron = this.cron.split(' ');
    if (splitCron.length !== 5) throw new GraphQLYogaError('Provided CRON is incorrect format');

    return {
      minutes: splitCron[0],
      hours: splitCron[1],
      dayOfMonth: splitCron[2],
      month: splitCron[3],
      dayOfWeek: splitCron[4],
    }
  }

  /**
   * Maps dayOfWeek cron sub string from number to day shorthand
   * @param dayOfWeek 
   * @returns 
   */
  private toDayOfWeek(dayOfWeek: string) {
    const parsedDayOfWeek = parseInt(dayOfWeek);
    switch (parsedDayOfWeek) {
      case 1:
        return 'MON';
      case 2:
        return 'TUE';
      case 3:
        return 'WED';
      case 4:
        return 'THU';
      case 5:
        return 'FRI';
      case 6:
        return 'SAT';
      case 7:
        return 'SUN';
      default:
        return dayOfWeek;
    }
  }
}