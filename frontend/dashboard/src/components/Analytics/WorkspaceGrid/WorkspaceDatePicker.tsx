import React from 'react';

import { DatePicker } from 'components/Common/DatePicker';
import { useDate } from 'hooks/useDate';

/**
 * Implementation of the generic DatePicker component for the workspace-grid,
 * containing logic for how to display the date picker, and initial start and end-dates.
 */
export const WorkspaceDatePicker = () => {
  const { getStartOfWeek } = useDate();
  const startDate = getStartOfWeek();
  const endDate = new Date();

  return (
    <div>
      <DatePicker
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};
