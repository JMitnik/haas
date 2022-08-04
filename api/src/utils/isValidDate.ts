import { GraphQLYogaError } from '@graphql-yoga/node';
import { endOfDay, parse, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

type dateType = 'START_DATE' | 'END_DATE'

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);

  return date instanceof Date && !Number.isNaN(date.getSeconds());
};

export const isADate = (dateString: string) => {
  const date = new Date(dateString);
  if (!(date instanceof Date && !Number.isNaN(date.getSeconds()))) {
    throw new GraphQLYogaError('Date invalid');
  }

  return date;
};

const setTime = (date: Date, isStartDate: boolean, isWithTime: boolean) => {
  if (isStartDate) {
    return isWithTime ? date : startOfDay(date);
  } else {
    return isWithTime ? date : endOfDay(date);
  }
}

export const isValidDateTime = (dateString: string, type: dateType) => {
  const formatString = dateString.split(':').length > 1 ? 'dd-MM-yyyy HH:mm' : 'dd-MM-yyyy';
  const isStartDate = type === 'START_DATE';
  const isWithTime = formatString === 'dd-MM-yyyy HH:mm';

  const dateObject = setTime(parse(
    dateString,
    formatString,
    new Date(),
  ), isStartDate, isWithTime);

  let utcDate = zonedTimeToUtc(dateObject, 'UTC');

  if (!(utcDate instanceof Date) || Number.isNaN(utcDate.getSeconds())) {
    throw new GraphQLYogaError(isStartDate ? 'Start date invalid' : 'End date invalid');
  }


  return utcDate;
};

export default isValidDate;
