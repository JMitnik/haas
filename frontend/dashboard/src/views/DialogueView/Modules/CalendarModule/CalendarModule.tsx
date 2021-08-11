import { ResponsiveTimeRange } from '@nivo/calendar';
import React from 'react';
import styled, { css } from 'styled-components';

const CalendarModuleContainer = styled.div`
  height: 400px;
`;

interface CalendarData {
  day: string;
  value: number;
}

interface CalendarModuleProps {
  data: CalendarData[];
  from: string;
  to: string;
}

export const CalendarModule = ({ data, from, to }: CalendarModuleProps) => {
  console.log(data);
  return (
    <CalendarModuleContainer>
      <ResponsiveTimeRange
        data={data}
        from={from}
        to={to}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        emptyColor="#eeeeee"
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
      />
    </CalendarModuleContainer>
  );
};

