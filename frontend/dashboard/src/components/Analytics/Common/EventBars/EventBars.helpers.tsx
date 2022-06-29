import { eachDayOfInterval, format } from 'date-fns';

import { DateFormat } from 'hooks/useDate';
import { DateHistogramItem } from 'types/generated-types';

export type Event = DateHistogramItem;

export const calculateDateRange = (events: Event[]) => {
  const startDate = events[0];
  const endDate = events[events.length - 1].date;

  const dateRange = eachDayOfInterval({ start: startDate.date, end: endDate });

  return dateRange.map((date) => format(date, DateFormat.DayFormat));
};
