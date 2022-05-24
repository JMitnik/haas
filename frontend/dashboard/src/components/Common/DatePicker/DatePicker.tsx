import * as UI from '@haas/ui';
import { DateFormat, useDate } from 'hooks/useDate';
import React from 'react';
import ReactDatePicker from 'react-datepicker';

import * as LS from './DatePicker.styles';

interface CustomInputProps {
  dateFormat?: DateFormat;
  value?: any;
  onClick?: any;
}

const CustomInput = React.forwardRef(({
  value,
  onClick,
  dateFormat = DateFormat.HumanGlobalWeekDayFormat,
}: CustomInputProps, ref) => {
  const { format } = useDate();

  return (
    <LS.DatePickerButton onClick={onClick} ref={ref}>
      {format(value, dateFormat)}
    </LS.DatePickerButton>
  );
});

export const DatePicker = () => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  return (
    <LS.DatePickerContainer>
      <ReactDatePicker
        selected={new Date()}
        selectsRange
        startDate={new Date()}
        endDate={null}
        customInput={<CustomInput />}
        onChange={() => { console.log('test'); }}
      />
    </LS.DatePickerContainer>
  );
};
