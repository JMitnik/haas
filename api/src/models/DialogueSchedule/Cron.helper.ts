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
      dayOfWeek: splitCron[4],
    }
  }

  toAWSCronString = (): string => {
    const { minutes, hours, dayOfMonth, dayOfWeek, month } = this.toSplitted();

    // Transform the CRON expression to one supported by AWS (? indicator is not part of cron-validator)
    const scheduledExpression = `cron(${minutes} ${hours} ${dayOfMonth === '*' ? '?' : dayOfMonth} ${month} ${dayOfMonth === '1' ? '?' : dayOfWeek} *)`

    return scheduledExpression;
  }

}