import { isValidCron } from 'cron-validator';
import { useEffect, useState } from 'react';
import later from '@breejs/later';

// Hook
function useCronSchedule(cronString: string) {
  // State and setters for debounced value
  const [schedule, setSchedule] = useState<string[] | undefined>();
  // later.date.localTime();

  useEffect(
    () => {
      if (cronString) {
        if (isValidCron(cronString, { alias: true, allowSevenAsSunday: true })) {
          const cron = later.parse.cron(cronString);
          const cronSchedule = later.schedule(cron).next(5);
          setSchedule(cronSchedule);
        } else {
          setSchedule(['CRON format not correct']);
        }
      } else {
        setSchedule([]);
      }
    },
    [cronString], // Only re-call effect if value or delay changes
  );

  return schedule;
}

export default useCronSchedule;
