import React, { useState, useMemo, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    // setActiveStartDate: (date: Date | null) => void;
    // setActiveEndDate: (date: Date | null) => void;
    handleDateChange: (start: Date | null, end: Date | null) => void;
}

const DatePickerComponent = ({activeStartDate, activeEndDate, handleDateChange} : DatePickerProps) => {

    return (
    <>
        <DatePicker
            selected={activeStartDate}
            onChange={date => handleDateChange(date, activeEndDate)}
            selectsStart
            startDate={activeStartDate}
            endDate={activeEndDate}
        />
        <DatePicker
            selected={activeEndDate}
            onChange={date => handleDateChange(activeStartDate, date)}
            selectsEnd
            startDate={activeStartDate}
            endDate={activeEndDate}
            minDate={activeStartDate}
        />
    </>
    )
}

export default DatePickerComponent;
