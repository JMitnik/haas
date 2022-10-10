import { SchedulePeriod } from '../SchedulePeriod.helper';

const WEEKLY_MONDAY_MIDDAY = '00 12 01 * 01';
const WEEKLY_FRIDAY_MIDDAY = '00 12 01 * 05';

describe('SchedulePeriod', () => {
  test('it interprets an active period as active correctly', () => {
    // 2022-10-10 15:00 is on a Monday
    jest.useFakeTimers().setSystemTime(new Date('2022-10-10 15:00'));
    const schedulePeriod = new SchedulePeriod(WEEKLY_MONDAY_MIDDAY, 60 * 4);

    expect(schedulePeriod.activeStartDate.toISOString()).toBe(new Date('2022-10-10 12:00').toISOString());
    expect(schedulePeriod.activeEndDate.toISOString()).toBe(new Date('2022-10-10 16:00').toISOString())
    expect(schedulePeriod.isActive).toBe(true);
  });

  test('it parses past expressions correctly after period is over', () => {
    // 2022-10-11 15:00 is on a Tuesday
    jest.useFakeTimers().setSystemTime(new Date('2022-10-11'));
    const schedulePeriod = new SchedulePeriod(WEEKLY_MONDAY_MIDDAY, 60 * 4);

    expect(schedulePeriod.activeStartDate.toISOString()).toBe(new Date('2022-10-10 12:00').toISOString());
    expect(schedulePeriod.activeEndDate.toISOString()).toBe(new Date('2022-10-10 16:00').toISOString())
    expect(schedulePeriod.isActive).toBe(false);
  });

  test('it interprets the last active period after period is over', () => {
    // 2022-10-13 15:00 is on a Thursday
    jest.useFakeTimers().setSystemTime(new Date('2022-10-13 15:00'));
    const schedulePeriod = new SchedulePeriod(WEEKLY_FRIDAY_MIDDAY, 60 * 4);

    expect(schedulePeriod.activeStartDate.toISOString()).toBe(new Date('2022-10-07 12:00').toISOString());
    expect(schedulePeriod.activeEndDate.toISOString()).toBe(new Date('2022-10-07 16:00').toISOString())
    expect(schedulePeriod.isActive).toBe(false);
  });
})
