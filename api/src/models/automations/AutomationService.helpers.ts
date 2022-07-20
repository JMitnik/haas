import { AutomationActionType, AutomationScheduled } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import {
  CustomRecurringType,
  DAYS,
  GenerateReportLambdaParams,
  SendDialogueLinkLambdaParams,
} from './AutomationService.types';


export const findLambdaParamsByActionType = (
  type: AutomationActionType,
  generateLambdaParams: GenerateReportLambdaParams,
  sendDialogueLinkParams: SendDialogueLinkLambdaParams,
) => {
  switch (type) {
    case AutomationActionType.SEND_DIALOGUE_LINK:
      return sendDialogueLinkParams;
    case AutomationActionType.WEEK_REPORT:
      return generateLambdaParams;
    case AutomationActionType.MONTH_REPORT:
      return sendDialogueLinkParams;
    case AutomationActionType.YEAR_REPORT:
      return generateLambdaParams;
    default:
      return generateLambdaParams;
  }
}
/**
 * Finds the correct lambdaArn based on automation action
 * @param type AutomationActionType
 * @returns lambda arn
 */
export const findLambdaArnByActionType = (type: AutomationActionType) => {
  switch (type) {
    case AutomationActionType.SEND_DIALOGUE_LINK:
      return process.env.SEND_DIALOGUE_LINK_LAMBDA_ARN as string;
    case AutomationActionType.WEEK_REPORT:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
    case AutomationActionType.MONTH_REPORT:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
    case AutomationActionType.YEAR_REPORT:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
    default:
      return process.env.GENERATE_REPORT_LAMBDA_ARN as string
  }
}

export const getDayRange = (dayOfWeek: string) => {
  const isWildcard = dayOfWeek.length === 1;
  if (isWildcard) return [];

  const splittedDays = dayOfWeek.split('-')
  const mappedToDayRange = splittedDays.map(
    (dayLabel) => DAYS.find((day) => day.label === dayLabel)
  ).filter(isPresent);
  return mappedToDayRange;
}

export const buildFrequencyCronString = (scheduledAutomation: AutomationScheduled) => {
  const frequency = `${scheduledAutomation.dayOfMonth} ${scheduledAutomation.month} ${scheduledAutomation.dayOfWeek}`;
  if (frequency === CustomRecurringType.YEARLY
    || frequency === CustomRecurringType.MONTHLY
    || frequency === CustomRecurringType.WEEKLY
  ) {
    return `${scheduledAutomation.dayOfMonth} ${scheduledAutomation.month} ${scheduledAutomation.dayOfWeek}`;
  }
  return '* *';
}