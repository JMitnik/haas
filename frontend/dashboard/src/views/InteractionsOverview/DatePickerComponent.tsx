import React, { useState, useMemo, useEffect } from 'react';
import {
    Container, Flex, Grid, H2, H3, Muted, Button,
    Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form
} from '@haas/ui';
import { XCircle, Calendar } from 'react-feather'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, formatDistance, differenceInCalendarDays } from 'date-fns';

interface DatePickerProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    // setActiveStartDate: (date: Date | null) => void;
    // setActiveEndDate: (date: Date | null) => void;
    handleDateChange: (start: Date | null, end: Date | null) => void;
}

const Input = ({ onChange, placeholder, value, id, onClick }: { onChange: any, placeholder: any, value: any, id: any, onClick: any }) => (
    <input
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
    />
);


const DatePickerComponent = ({ activeStartDate, activeEndDate, handleDateChange }: DatePickerProps) => {
    const [isActive, setIsActive] = useState(false);

    console.log('IS ACTIVE?', isActive)
    return (

        <Div style={{ marginRight: '5px'}}>
            {
                !isActive &&
                <Div onClick={() => setIsActive(true)} padding={15} style={{ borderRadius: '90px' }} justifyContent='space-between' useFlex alignItems='center' flexDirection='row' justifyItems='center' backgroundColor='#f1f5f8'>
                    {
                        (!activeStartDate && !activeEndDate) &&
                        <div style={{ color: '#6d767d'}}>ALL-TIME</div>
                    }
                    {
                        (activeStartDate && !activeEndDate) &&
                        <div style={{ color: '#6d767d'}}>From {format(activeStartDate, 'dd-MMM-yyyy')}</div>
                    }
                    {
                        (!activeStartDate && activeEndDate) &&
                        <div style={{ color: '#6d767d'}}>Until {format(activeEndDate, 'dd-MMM-yyyy')}</div>
                    }
                    {
                        (activeStartDate && activeEndDate) &&
                        <div style={{ color: '#6d767d'}}>{format(activeStartDate, 'dd-MMM-yyyy') + ' until ' + format(activeEndDate, 'dd-MMM-yyyy')}</div>
                    }
                    <Calendar style={{ marginLeft: '10px', color: '#6d767d'}}/>
                </Div>
            }
            {
                isActive &&
                <Div padding={15} style={{ borderRadius: '90px' }} useFlex flexDirection='row' backgroundColor='#f1f5f8'>
                    <DatePicker
                        selected={activeStartDate}
                        onChange={date => handleDateChange(date, activeEndDate)}
                        selectsStart
                        isClearable
                        // customInput={<Input />}
                        startDate={activeStartDate}
                        endDate={activeEndDate}
                    />
                    <DatePicker
                        selected={activeEndDate}
                        onChange={date => handleDateChange(activeStartDate, date)}
                        selectsEnd
                        isClearable
                        startDate={activeStartDate}
                        endDate={activeEndDate}
                        minDate={activeStartDate}
                    />
                    <XCircle onClick={() => setIsActive(false)} style={{ color: '#6d767d', marginLeft: '10px'}}/>
                </Div>
            }

        </Div>
    )
}

export default DatePickerComponent;
