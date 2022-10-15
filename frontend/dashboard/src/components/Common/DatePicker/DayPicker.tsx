/* eslint-disable @typescript-eslint/no-unused-vars */
import * as UI from '@haas/ui';
import React, { useState } from 'react';

import * as Popover from 'components/Common/Popover';
import styled, { css } from 'styled-components';

export type Day = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export const days: Day[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const DaySelectorContainer = styled(UI.Div) <{ isSelected?: boolean, isWithinRange?: boolean }>`
  ${({ isSelected, theme }) => css`
    display: flex;
    justify-content: center;
    cursor: pointer;
    padding: 0.5em;
    border-radius: 180px;
    border: 1px solid ${theme.colors.main['50']};
    box-shadow: ${theme.boxShadows.md};

    color: auto;

    ${isSelected && css`
      background-color: ${isSelected ? theme.colors.main['500'] : 'auto'};
      color: white;
    `}

    ${!isSelected && css`
      :hover {
        background-color: ${theme.colors.main['50']};
      }
    `}
  `}
`;

interface DayPickerProps {
  onChange: (day: Day) => void;
  value?: Day;
}

export const DayPickerContent = ({ value, onChange }: DayPickerProps) => {
  const handleChangeDate = (entry: Day) => {
    onChange(entry);
  };

  return (
    <UI.Card>
      <UI.Grid padding="0.5em" gridTemplateColumns="repeat(7, 1fr)">
        {days.map((day) => (
          <DaySelectorContainer
            key={day}
            isSelected={day === value}
            onClick={() => handleChangeDate(day)}
          >
            {day}
          </DaySelectorContainer>
        ))}
      </UI.Grid>
    </UI.Card>
  );
};

interface DayPickerSelectProps {
  children: React.ReactChild;
  onChange: (day: Day) => void;
  value: Day;
}

export const DayPicker = ({ children, value, onChange }: DayPickerSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (day: Day) => {
    onChange(day);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        {children}
      </Popover.Trigger>
      <Popover.Content isOpen={isOpen}>
        <DayPickerContent
          value={value}
          onChange={handleChange}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
