import { DateFormat, useDate } from 'hooks/useDate';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import * as LS from './DatePicker.styles';

interface CustomInputProps {
  dateFormat?: DateFormat;
  value?: any;
  onClick?: any;
}

const RangeDatePickerButton = React.forwardRef<HTMLButtonElement, CustomInputProps>(({
  value,
  onClick,
  dateFormat = DateFormat.HumanGlobalWeekDayFormat,
}: CustomInputProps, ref) => {
  const { format, parseRangeString, isValid } = useDate();

  const [startDate, endDate] = parseRangeString(value, DateFormat.DayFormat);

  const valueStartDate = isValid(startDate) ? format(startDate, dateFormat) : null;
  const valueEndDate = isValid(endDate) ? format(endDate, dateFormat) : null;

  return (
    <LS.DatePickerButton onClick={onClick} ref={ref}>
      {valueStartDate}
      {' '}
      -
      {' '}
      {valueEndDate}
    </LS.DatePickerButton>
  );
});

const SingleDatePickerButton = React.forwardRef<HTMLButtonElement, CustomInputProps>(({
  value,
  onClick,
  dateFormat = DateFormat.HumanGlobalWeekDayFormat,
}: CustomInputProps, ref) => {
  const { format, parse, isValid } = useDate();

  const parsedValue = parse(value, DateFormat.DayFormat);

  const valueFormatted = isValid(parsedValue) ? format(parsedValue, dateFormat) : null;
  // const valueFormatted = null;
  // console.log(typeof value);

  return (
    <LS.DatePickerButton onClick={onClick} ref={ref}>
      {valueFormatted}
    </LS.DatePickerButton>
  );
});

interface BaseDatePickerProps {
  format?: DateFormat;
}

export interface SingleDatePickerProps extends BaseDatePickerProps {
  type: 'single';
  date: Date;
  onChange: (date: Date) => void;
}

export interface RangeDatePickerProps extends BaseDatePickerProps {
  type: 'range';
  startDate: Date;
  endDate: Date;
  onChange: (dateRange: [Date, Date]) => void;
  /** If true, will call onChange only when the entire range has been selected. */
  changeWhenFullRange?: boolean;
}

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

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

const RangeDatePicker = ({ startDate, endDate, onChange, changeWhenFullRange = true }: RangeDatePickerProps) => {
  const [localDates, setLocalDates] = useState([startDate, endDate]);
  const [localStartDate, localEndDate] = localDates;

  /**
   * This is a workaround to prevent the onChange handle from pushing any "unfinished" calendar events.
   */
  useEffect(() => {
    // If `changeWhenFullRange` is disabled, always synchronize with local datepicker.
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

export const DatePicker = (props: DatePickerProps) => {
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
