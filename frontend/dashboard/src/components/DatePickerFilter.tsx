import { Calendar } from 'react-feather'
import { Div } from '@haas/ui';
import { format } from 'date-fns';
import React from 'react';

interface DatePickerProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    handleDateChange: (start: Date | null, end: Date | null) => void;
}

interface DatePickerFilterProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatePickerFilter = ({ activeStartDate, activeEndDate, setIsActive } : DatePickerFilterProps) => (
  <Div borderRadius="90px" color="#6d767d" onClick={() => setIsActive(true)} padding={15} useFlex justifyContent="space-between" alignItems="center" flexDirection="row" justifyItems="center" backgroundColor="#f1f5f8">
    { (!activeStartDate && !activeEndDate)
    && (<Div>ALL-TIME</Div>)}
    { (activeStartDate && !activeEndDate) && (
    <Div>
      From
      {' '}
      {format(activeStartDate, 'dd-MMM-yyyy')}
    </Div>
        )}
    { (!activeStartDate && activeEndDate) && (
    <Div>
      Until
      {' '}
      {format(activeEndDate, 'dd-MMM-yyyy')}
    </Div>
     )}
    { (activeStartDate && activeEndDate)
    && (
    <Div>
      {`${format(activeStartDate, 'dd-MMM-yyyy')} until ${format(activeEndDate, 'dd-MMM-yyyy')}`}
    </Div>
)}
    <Calendar style={{ marginLeft: '10px', color: '#6d767d' }} />
  </Div>
    )

export default DatePickerFilter;
