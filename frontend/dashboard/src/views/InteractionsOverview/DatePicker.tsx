import 'react-datepicker/dist/react-datepicker.css';
import { XCircle } from 'react-feather';
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import { Div } from '@haas/ui';
import DatePickerFilter from 'components/DatePickerFilter';

interface DatePickerProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

const DatePicker = ({ activeStartDate, activeEndDate, onDateChange }: DatePickerProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Div mr="5px">
      {!isActive && (
        <DatePickerFilter
          activeStartDate={activeStartDate}
          activeEndDate={activeEndDate}
          setIsActive={setIsActive}
        />
      )}
      {isActive && (
        <Div padding={15} borderRadius="90px" useFlex flexDirection="row" backgroundColor="#f1f5f8">
          <ReactDatePicker
            selected={activeStartDate}
            onChange={(date) => date !== activeStartDate && onDateChange(date, activeEndDate)}
            selectsStart
            isClearable
            startDate={activeStartDate}
            endDate={activeEndDate}
          />
          <ReactDatePicker
            selected={activeEndDate}
            onChange={(date) => date !== activeEndDate && onDateChange(activeStartDate, date)}
            selectsEnd
            isClearable
            startDate={activeStartDate}
            endDate={activeEndDate}
            minDate={activeStartDate}
          />
          <XCircle onClick={() => setIsActive(false)} color="#6d767d" style={{ marginLeft: '10px' }} />
        </Div>
      )}
    </Div>
  );
};

export default DatePicker;
