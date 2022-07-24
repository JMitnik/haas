import * as UI from '@haas/ui';
import { Calendar, ChevronDown } from 'react-feather';
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
  dateFormat = DateFormat.DayFormat,
}: CustomInputProps, ref) => {
  const { format, parseRangeString, isValid } = useDate();

  const [startDate, endDate] = parseRangeString(value, DateFormat.DayFormat);

  const valueStartDate = isValid(startDate) ? format(startDate, dateFormat) : null;
  const valueEndDate = isValid(endDate) ? format(endDate, dateFormat) : null;

  return (
    <LS.DatePickerButton onClick={onClick} ref={ref}>
      <UI.Flex>
        <UI.Div width="24px" mr={1}>
          <UI.Icon color="off.400">
            <Calendar />
          </UI.Icon>
        </UI.Div>

        <UI.Div>
          {valueStartDate}
          <UI.Span mx={1}>
            -
          </UI.Span>
          {valueEndDate}
          <UI.Icon ml={1}>
            <ChevronDown />
          </UI.Icon>
        </UI.Div>
      </UI.Flex>
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
