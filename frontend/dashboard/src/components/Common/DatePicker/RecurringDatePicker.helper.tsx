import { CustomRecurringType } from 'views/AddAutomationView/AutomationForm.types';

export const recurringDateToCron = (dateType: CustomRecurringType) => {
  switch (dateType) {
    case CustomRecurringType.DAILY: {
      // Every day at 8AM
      return '0 8 * * *';
    }

    case CustomRecurringType.WEEKLY: {
      // Every monday at 8AM
      return '0 8 * * 1';
    }

    case CustomRecurringType.MONTHLY: {
      // Every first day of month at 8AM
      return '0 8 1 * *';
    }

    case CustomRecurringType.YEARLY: {
      // Every first January
      return '0 8 1 1 *';
    }

    default: {
      const type: never = dateType;
      throw new Error(`Unknown type ${type}`);
    }
  }
};

export const recurringDateToEndDeltaMinutes = (dateType: CustomRecurringType) => {
  switch (dateType) {
    case CustomRecurringType.DAILY: {
      // We start at every day at 8AM, and 24 hours = 24 * 60 minutes we restart
      return 24 * 60;
    }

    case CustomRecurringType.WEEKLY: {
      // We start every week at 8am, and 24 hours * 7 days later we restart
      return 24 * 60 * 7;
    }

    case CustomRecurringType.MONTHLY: {
      // Tricky, temporary solution: just estimate 30 days
      // TODO: calculate this properly in backend
      return 30 * 24 * 60;
    }

    case CustomRecurringType.YEARLY: {
      // Every first January
      return 365 * 24 * 60;
    }

    default: {
      const type: never = dateType;
      throw new Error(`Unknown type ${type}`);
    }
  }
};
