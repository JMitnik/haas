import "react-datepicker/dist/react-datepicker.css";
import { XCircle } from 'react-feather'
import DatePicker from "react-datepicker";
import React, { useState } from 'react';

import { Div } from '@haas/ui';
import DatePickerFilter from 'components/DatePickerFilter';

interface DatePickerProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    handleDateChange: (start: Date | null, end: Date | null) => void;
}

const DatePickerComponent = ({ activeStartDate, activeEndDate, handleDateChange }: DatePickerProps) => {
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
        { isActive && (
        <Div padding={15} style={{ borderRadius: '90px' }} useFlex flexDirection="row" backgroundColor="#f1f5f8">
          <DatePicker
            selected={activeStartDate}
            onChange={(date) => date !== activeStartDate && handleDateChange(date, activeEndDate)}
            selectsStart
            isClearable
            startDate={activeStartDate}
            endDate={activeEndDate}
          />
          <DatePicker
            selected={activeEndDate}
            onChange={(date) => date !== activeEndDate && handleDateChange(activeStartDate, date)}
            selectsEnd
            isClearable
            startDate={activeStartDate}
            endDate={activeEndDate}
            minDate={activeStartDate}
          />
          <XCircle onClick={() => setIsActive(false)} style={{ color: '#6d767d', marginLeft: '10px' }} />
        </Div>
                )}
      </Div>
    )
}

export default DatePickerComponent;
