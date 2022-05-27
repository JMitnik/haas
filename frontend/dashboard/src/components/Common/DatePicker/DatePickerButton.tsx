import * as UI from '@haas/ui';
import { ChevronDown } from 'react-feather';
import { DateFormat, useDate } from 'hooks/useDate';
import React from 'react';

import * as LS from './DatePicker.styles';

interface CustomInputProps {
  dateFormat?: DateFormat;
  value?: any;
  onClick?: any;
}

export const RangeDatePickerButton = React.forwardRef<HTMLButtonElement, CustomInputProps>(({
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
      <UI.Span mx={1}>
        -
      </UI.Span>
      {valueEndDate}
      <UI.Icon ml={2}>
        <ChevronDown />
      </UI.Icon>
    </LS.DatePickerButton>
  );
});

export const SingleDatePickerButton = React.forwardRef<HTMLButtonElement, CustomInputProps>(({
  value,
  onClick,
  dateFormat = DateFormat.HumanGlobalWeekDayFormat,
}: CustomInputProps, ref) => {
  const { format, parse, isValid } = useDate();

  const parsedValue = parse(value, DateFormat.DayFormat);

  const valueFormatted = isValid(parsedValue) ? format(parsedValue, dateFormat) : null;

  return (
    <LS.DatePickerButton onClick={onClick} ref={ref}>
      {valueFormatted}
    </LS.DatePickerButton>
  );
});
