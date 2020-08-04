import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'react-feather';
import React from 'react';
import ReactDatePicker from 'react-datepicker';

import { Div, Flex, Span } from '@haas/ui';
import styled, { css } from 'styled-components';

interface DatePickerProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

const CustomPickerInput = styled.input <{hasDate?: boolean}>`
  ${({ theme, hasDate }) => css`
    background: ${theme.colors.app.mutedOnDefault};
    border: transparent;
    border-bottom: 1px solid ${theme.colors.default.dark};
    width: 75px;
    color: ${theme.colors.default.darker};

    ${hasDate && css`
      border: none;
    `}

    &:focus {
      transition: all 0.2s ease-in;
      outline-width: 0;
      border: transparent;
      outline: none;
      border-bottom: 1px solid ${theme.colors.app.mutedAltOnDefault};
      box-shadow: none;
    }
  `};
`;

const DatePicker = ({ activeStartDate, activeEndDate, onDateChange }: DatePickerProps) => (
  <Div mr="5px">
    <Div padding="4.5px 12px" borderRadius="6px" useFlex flexDirection="row" backgroundColor="app.mutedOnDefault">
      <Flex>
        <Span fontWeight="200" color="app.mutedAltOnDefault">
          Start
        </Span>
        <Calendar stroke="#838890" width="1em" style={{ marginLeft: '5px', marginRight: '5px' }} />
        <ReactDatePicker
          selected={activeStartDate}
          onChange={(date) => date !== activeStartDate && onDateChange(date, activeEndDate)}
          selectsStart
          startDate={activeStartDate}
          endDate={activeEndDate}
          customInput={(
            <CustomPickerInput
              type="text"
              id="CustomID"
              placeholder="Date"
              hasDate={!!activeStartDate}
            />
            )}
        />
      </Flex>
      <Span padding="0 5px" color="app.mutedAltOnDefault">
        |
      </Span>
      <Flex>
        <Span fontWeight="200" color="app.mutedAltOnDefault">
          End
        </Span>
        <Calendar stroke="#838890" width="1em" style={{ marginLeft: '5px', marginRight: '5px' }} />
        <ReactDatePicker
          selected={activeEndDate}
          onChange={(date) => date !== activeEndDate && onDateChange(activeStartDate, date)}
          selectsEnd
          startDate={activeStartDate}
          endDate={activeEndDate}
          minDate={activeStartDate}
          customInput={(
            <CustomPickerInput
              type="text"
              id="CustomID"
              placeholder="Date"
              hasDate={!!activeEndDate}
            />
            )}
        />
      </Flex>
    </Div>
  </Div>
);

export default DatePicker;
