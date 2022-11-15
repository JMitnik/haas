import { isValidCron } from 'cron-validator';
import { useEffect, useState } from 'react';
import later from '@breejs/later';

/**
 * Given a Cron expression, calculates the next `iterations` dates this occurs.
 */
function useCronSchedule(
  cronString: string,
  iterations: number = 5,
): Date[] {
  const [schedule, setSchedule] = useState<Date[]>([]);

  useEffect(
    () => {
      if (cronString) {
        if (isValidCron(cronString, { alias: true, allowSevenAsSunday: true })) {
          const cron = later.parse.cron(cronString);
          const cronSchedule = later.schedule(cron).next(iterations);
          setSchedule(cronSchedule);
        } else {
          setSchedule([]);
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
