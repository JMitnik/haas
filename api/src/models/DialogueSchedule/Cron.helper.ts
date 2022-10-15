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

}