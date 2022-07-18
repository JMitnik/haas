import { isValidCron } from 'cron-validator';
import { useEffect, useState } from 'react';
import later from '@breejs/later';

// Hook
function useCronSchedule(cronString: string) {
  const [schedule, setSchedule] = useState<Date[] | undefined>();
  useEffect(
    () => {
      if (cronString) {
        if (isValidCron(cronString, { alias: true, allowSevenAsSunday: true })) {
          const cron = later.parse.cron(cronString);
          const cronSchedule = later.schedule(cron).next(5);
          setSchedule(cronSchedule);
        } else {
          setSchedule(undefined);
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
