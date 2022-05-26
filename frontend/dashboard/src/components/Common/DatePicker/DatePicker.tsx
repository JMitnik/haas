import { DateFormat, useDate } from 'hooks/useDate';
import React from 'react';
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
  console.log(value);

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

const RangeDatePicker = ({ startDate, endDate, onChange }: RangeDatePickerProps) => (
  <LS.DatePickerContainer>
    <ReactDatePicker
      selected={startDate}
      selectsRange /** @ts-ignore */
      startDate={startDate}
      endDate={endDate || null}
      dateFormat={DateFormat.DayFormat}
      customInput={<RangeDatePickerButton />}
      onChange={(dates) => onChange(dates as unknown as [Date, Date])}
    />
  </LS.DatePickerContainer>
);

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
