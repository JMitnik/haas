import { eachDayOfInterval, format, getDayOfYear } from 'date-fns';

import { DateFormat } from 'hooks/useDate';
import { DateHistogramItem } from 'types/generated-types';

export type Event = DateHistogramItem;

export const calculateDateRange = (startDate: Date, endDate: Date) => {
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return dateRange.map((date) => format(date, DateFormat.DayFormat));
};

/**
 * Pad events DateRange with empty events on inactive days.
 *
 * E.g.: events on day 1, day 5 and 7, now are padded in between on day 2,3,4 and 6 with empty events.
 */
export const padEvents = (events: Event[], startDate: Date, endDate: Date) => {
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const paddedEvents: Event[] = dateRange.map(date => {
    const day = getDayOfYear(date);
    const matchingEvent = events.find(event => getDayOfYear(event.date) === day);

    if (!matchingEvent) {
      return {
        id: `${day}-empty`,
        date,
        frequency: 0.1,
      };
    }

    return matchingEvent;
  });

  return paddedEvents;
}
