import { format, isValid, parse } from 'date-fns';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import qs from 'qs';

import { useNavigator } from './useNavigator';
import useLocalStorage from './useLocalStorage';

interface UseDateFilterProps {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  dateFormat?: string;
  localStorageKey?: string;
  urlStartDateKey?: string;
  urlEndDateKey?: string;
}

export const useDateFilter = ({
  defaultEndDate = undefined,
  defaultStartDate = undefined,
  dateFormat = 'dd-MM-yyyy',
  urlStartDateKey = 'startDate',
  urlEndDateKey = 'endDate',
}: UseDateFilterProps) => {
  const location = useLocation();

  const [[startDate, endDate], setDateRange] = useState(() => {
    // These are the default dates if no local-storage has been set
    let initStartDate = defaultStartDate;
    let initEndDate = defaultEndDate;

    const urlParams = qs.parse(location.search, { ignoreQueryPrefix: true });

    // If URL param is set, override it
    const parsedStartDate = parse(urlParams?.[urlStartDateKey] as string, dateFormat, new Date());
    if (isValid(parsedStartDate)) {
      initStartDate = parsedStartDate;
    }

    const parsedEndDate = parse(urlParams?.[urlEndDateKey] as string, dateFormat, new Date());
    if (isValid(parsedEndDate)) {
      initEndDate = parsedEndDate;
    }

    return [initStartDate, initEndDate];
  });

  const setDate = (dateRange: [Date, Date]) => {
    if (dateRange === null) {
      setDateRange([undefined, undefined]);
    } else {
      setDateRange(dateRange);
    }
  };

  return {
    startDate,
    endDate,
    setDate,
  };
};
