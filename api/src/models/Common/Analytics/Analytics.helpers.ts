import { DateHistogramItem } from './Analytics.types';

/**
 * Convers a list of dates to a grouped histogram (grouped by day).
 * @param dates
 * @returns Histogram items
 * 
 * Precondition: dates should already be sorted.
 */
export const convertDatesToHistogramItems = (dates: Date[]): DateHistogramItem[] => {
  const keyedHistogram: Record<string, DateHistogramItem> = {};

  dates.forEach(date => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const key = `${year}-${month}-${day}`;
    if (!keyedHistogram[key]) {
      keyedHistogram[key] = {
        date,
        frequency: 1,
        id: key,
      };

      return;
    }

    keyedHistogram[key] = {
      ...keyedHistogram[key],
      frequency: keyedHistogram[key].frequency + 1,
    };
  });

  return Object.values(keyedHistogram);
}
