import * as Popover from 'components/Common/Popover';
import * as UI from '@haas/ui';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';

import * as Select from 'components/Common/Select';
import SearchBar from 'components/Common/SearchBar';

const times = [
  '00:00AM',
  '00:15AM',
  '00:30AM',
  '00:45AM',
  '01:00AM',
  '01:15AM',
  '01:30AM',
  '01:45AM',
  '02:00AM',
  '02:15AM',
  '02:30AM',
  '02:45AM',
  '03:00AM',
  '03:15AM',
  '03:30AM',
  '03:45AM',
  '04:00AM',
  '04:15AM',
  '04:30AM',
  '04:45AM',
  '05:00AM',
  '05:15AM',
  '05:30AM',
  '05:45AM',
  '06:00AM',
  '06:15AM',
  '06:30AM',
  '06:45AM',
  '07:00AM',
  '07:15AM',
  '07:30AM',
  '07:45AM',
  '08:00AM',
  '08:15AM',
  '08:30AM',
  '08:45AM',
  '09:00AM',
  '09:15AM',
  '09:30AM',
  '09:45AM',
  '10:00AM',
  '10:15AM',
  '10:30AM',
  '10:45AM',
  '11:00AM',
  '11:15AM',
  '11:30AM',
  '11:45AM',
  '12:00PM',
  '12:15PM',
  '12:30PM',
  '12:45PM',
  '13:00PM',
  '13:15PM',
  '13:30PM',
  '13:45PM',
  '14:00PM',
  '14:15PM',
  '14:30PM',
  '14:45PM',
  '15:00PM',
  '15:15PM',
  '15:30PM',
  '15:45PM',
  '16:00PM',
  '16:15PM',
  '16:30PM',
  '16:45PM',
  '17:00PM',
  '17:15PM',
  '17:30PM',
  '17:45PM',
  '18:00PM',
  '18:15PM',
  '18:30PM',
  '18:45PM',
  '19:00PM',
  '19:15PM',
  '19:30PM',
  '19:45PM',
  '20:00PM',
  '20:15PM',
  '20:30PM',
  '20:45PM',
  '21:00PM',
  '21:15PM',
  '21:30PM',
  '21:45PM',
  '22:00PM',
  '22:15PM',
  '22:30PM',
  '22:45PM',
  '23:00PM',
  '23:15PM',
  '23:30PM',
  '23:45PM',
];

interface TimePickerSelectProps {
  onChange: (e: string) => void;
  value?: string;
}

export const TimePickerContent = ({ onChange, value }: TimePickerSelectProps) => {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(times);

  useEffect(
    () => {
      if (!search) setFilteredItems(times);

      setFilteredItems(times.filter((time) => time.includes(search)));
    }, [search],
  );
  return (
    <UI.Div>
      <Select.Root value={value} onValueChange={onChange} defaultValue={value || '9:00AM'}>
        <Select.SelectTrigger aria-label="Food">
          <Select.SelectValue />
          <Select.SelectIcon>
            <ChevronDownIcon />
          </Select.SelectIcon>
        </Select.SelectTrigger>
        <Select.SelectContent>
          <Select.SelectScrollUpButton>
            <ChevronUpIcon />
          </Select.SelectScrollUpButton>
          <Select.SelectViewport>
            <SearchBar
              key="searchy"
              search={search}
              onSearchChange={(e) => setSearch(e)}
            />
            <Select.SelectGroup>
              {filteredItems.map((item) => (
                <Select.SelectItem key={item} value={item}>
                  <Select.SelectItemText>{item}</Select.SelectItemText>
                  <Select.SelectItemIndicator>
                    <CheckIcon />
                  </Select.SelectItemIndicator>
                </Select.SelectItem>
              ))}
            </Select.SelectGroup>
          </Select.SelectViewport>
          <Select.SelectScrollDownButton>
            <ChevronDownIcon />
          </Select.SelectScrollDownButton>
        </Select.SelectContent>
      </Select.Root>
    </UI.Div>
  );
};

interface TimePickerProps {
  children?: React.ReactChild;
  value?: string;
  onChange: (time: string) => void;
}

export const TimePicker = ({ children, value, onChange }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (time: string) => {
    onChange(time);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        {children}
      </Popover.Trigger>
      <Popover.Content isOpen={isOpen}>
        <TimePickerContent value={value} onChange={handleChange} />
      </Popover.Content>
    </Popover.Root>
  );
};
