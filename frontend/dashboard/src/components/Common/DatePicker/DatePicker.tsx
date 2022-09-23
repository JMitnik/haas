import { DateFormat } from 'hooks/useDate';
import { isEqual } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import * as LS from './DatePicker.styles';
import { RangeDatePickerButton, SingleDatePickerButton } from './DatePickerButton';

interface BaseDatePickerProps {
  format?: DateFormat;
}

export interface SingleDatePickerProps extends BaseDatePickerProps {
  type: 'single';
  date: Date;
  onChange: (date: Date) => void;
}

const SingleDatePicker = ({ date, onChange }: SingleDatePickerProps) => (
  <LS.DatePickerContainer>
    <ReactDatePicker
      selected={date}
      customInput={<SingleDatePickerButton />}
      onChange={onChange}
      dateFormat={DateFormat.DayFormat}
    />
  </LS.DatePickerContainer>
);

export interface RangeDatePickerProps extends BaseDatePickerProps {
  type: 'range';
  startDate: Date;
  endDate: Date;
  onChange: (dateRange: [Date, Date]) => void;
  /** If true, will call onChange only when the entire range has been selected. */
  changeWhenFullRange?: boolean;
}

export const RangeDatePicker = ({ startDate, endDate, onChange, changeWhenFullRange = true }: RangeDatePickerProps) => {
  const [localDates, setLocalDates] = useState([startDate, endDate]);
  const [localStartDate, localEndDate] = localDates;

  /**
   * This is a workaround to prevent the onChange handle from pushing any "unfinished" calendar events.
   */
  useEffect(() => {
    if (isEqual(localStartDate, startDate) && isEqual(localEndDate, endDate)) return;

    console.log(localStartDate, localEndDate, onChange, changeWhenFullRange);

    if (!changeWhenFullRange) {
      onChange([localStartDate, localEndDate]);
      return;
    }

    // If `changeWhenFullRange` is enabled, only synchronize with local datepicker if the range is complete.
    if (localStartDate && localEndDate) {
      onChange([localStartDate, localEndDate]);
    }
  }, [localStartDate, localEndDate, onChange, changeWhenFullRange]);

  return (
    <LS.DatePickerContainer>
      <ReactDatePicker
        selected={localStartDate}
        selectsRange
        startDate={localStartDate}
        endDate={localEndDate || null}
        dateFormat={DateFormat.DayFormat}
        onCalendarClose={() => {
          if (!localEndDate) {
            setLocalDates([startDate, endDate]);
          }
        }}
        customInput={<RangeDatePickerButton />}
        onChange={(dates) => {
          setLocalDates(dates as unknown as [Date, Date]);
        }}
      />
    </LS.DatePickerContainer>
  );
};

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

export const DatePicker = (props: DatePickerProps) => {
  console.log('date picker props: ', props);
  switch (props.type) {
    case 'single': {
      return <SingleDatePicker {...props} />;
    }

    case 'range': {
      return <RangeDatePicker {...props} />;
    }

    default: {
      return null;
    }
  }
};
