import { Div } from '@haas/ui';
import { Menu, MenuHeader, MenuItem } from 'components/Menu/Menu';
import Dropdown from 'components/Dropdown';
import React, { useEffect, useState } from 'react';

interface DatePickerOptionsProps {
  onDatePickerOptionsChange: (newActiveDate: string) => void;
}

const DatePickerOptions = ({ onDatePickerOptionsChange }: DatePickerOptionsProps) => (
  <Menu>
    <MenuHeader>Date Options</MenuHeader>
    <MenuItem onClick={() => onDatePickerOptionsChange('Last 24h')}>Last 24h</MenuItem>
    <MenuItem onClick={() => onDatePickerOptionsChange('Last week')}>Last week</MenuItem>
    <MenuItem onClick={() => onDatePickerOptionsChange('Last month')}>Last month</MenuItem>
    <MenuItem onClick={() => onDatePickerOptionsChange('Last year')}>Last year</MenuItem>
  </Menu>
);

interface DatePickerProps {
  onActiveDateChange: (activeDate: string) => void;
}

const DatePicker = ({ onActiveDateChange }: DatePickerProps) => {
  const [activeDate, setActiveDate] = useState<string>(() => 'Last 24h');

  const handleDatePickerOptionsChange = (newActiveDate: string) => {
    setActiveDate(newActiveDate);
  };

  useEffect(() => {
    onActiveDateChange(activeDate);
  }, [onActiveDateChange, activeDate]);

  return (
    <Div>
      <Dropdown renderOverlay={<DatePickerOptions onDatePickerOptionsChange={handleDatePickerOptionsChange} />}>
        {activeDate}
      </Dropdown>
    </Div>
  );
};

export default DatePicker;
