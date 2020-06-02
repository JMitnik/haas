import React, { useState } from 'react';
import { Div } from '@haas/ui';
import { XCircle, Calendar } from 'react-feather'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

interface DatePickerProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    handleDateChange: (start: Date | null, end: Date | null) => void;
}

const DatePickerComponent = ({ activeStartDate, activeEndDate, handleDateChange }: DatePickerProps) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <Div style={{ marginRight: '5px' }}>
            {
                !isActive &&
                <Div onClick={() => setIsActive(true)} padding={15} style={{ borderRadius: '90px' }} justifyContent='space-between' useFlex alignItems='center' flexDirection='row' justifyItems='center' backgroundColor='#f1f5f8'>
                    {
                        (!activeStartDate && !activeEndDate) &&
                        <div style={{ color: '#6d767d' }}>ALL-TIME</div>
                    }
                    {
                        (activeStartDate && !activeEndDate) &&
                        <div style={{ color: '#6d767d' }}>From {format(activeStartDate, 'dd-MMM-yyyy')}</div>
                    }
                    {
                        (!activeStartDate && activeEndDate) &&
                        <div style={{ color: '#6d767d' }}>Until {format(activeEndDate, 'dd-MMM-yyyy')}</div>
                    }
                    {
                        (activeStartDate && activeEndDate) &&
                        <div style={{ color: '#6d767d' }}>{format(activeStartDate, 'dd-MMM-yyyy') + ' until ' + format(activeEndDate, 'dd-MMM-yyyy')}</div>
                    }
                    <Calendar style={{ marginLeft: '10px', color: '#6d767d' }} />
                </Div>
            }
            {
                isActive &&
                <Div padding={15} style={{ borderRadius: '90px' }} useFlex flexDirection='row' backgroundColor='#f1f5f8'>
                    <DatePicker
                        selected={activeStartDate}
                        onChange={date => date !== activeStartDate && handleDateChange(date, activeEndDate)}
                        selectsStart
                        isClearable
                        startDate={activeStartDate}
                        endDate={activeEndDate}
                    />
                    <DatePicker
                        selected={activeEndDate}
                        onChange={date => date !== activeEndDate && handleDateChange(activeStartDate, date)}
                        selectsEnd
                        isClearable
                        startDate={activeStartDate}
                        endDate={activeEndDate}
                        minDate={activeStartDate}
                    />
                    <XCircle onClick={() => setIsActive(false)} style={{ color: '#6d767d', marginLeft: '10px' }} />
                </Div>
            }
        </Div>
    )
}

export default DatePickerComponent;
