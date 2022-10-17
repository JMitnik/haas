import {
  PrismaClient,
  AutomationType,
  AutomationScheduled,
} from 'prisma/prisma-client';
import { GraphQLYogaError } from '@graphql-yoga/node';

export class Cron {
  constructor(public cron: string) { }

  toSplitted() {
    const splitCron = this.cron.split(' ');
    if (splitCron.length !== 5) throw new GraphQLYogaError('Provided CRON is incorrect format');

    return {
      minutes: splitCron[0],
      hours: splitCron[1],
      dayOfMonth: splitCron[2],
      month: splitCron[3],
      dayOfWeek: this.toDayOfWeek(splitCron[4]),
    }
  }

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

  toAWSCronString = (): string => {
    const { minutes, hours, dayOfMonth, dayOfWeek, month } = this.toSplitted();

    // Transform the CRON expression to one supported by AWS (? indicator is not part of cron-validator)
    const scheduledExpression = `cron(${minutes} ${hours} ${dayOfMonth === '*' ? '?' : dayOfMonth} ${month} ${dayOfMonth === '1' ? '?' : dayOfWeek} *)`

    return scheduledExpression;
  }

}