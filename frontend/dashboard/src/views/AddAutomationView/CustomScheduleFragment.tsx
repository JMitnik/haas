import * as UI from '@haas/ui';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as Select from 'components/Common/Select';
import { RecurringPeriodType } from 'types/generated-types';

import { CustomRecurringType } from './AutomationForm.types';
import { DEPTH_BACKGROUND_COLORS } from './AutomationForm.constants';
import { DayPicker } from './DayPicker';
import { TimePickerContent } from './TimePicker';

export const CustomScheduleFragment = () => {
  const form = useFormContext();
  const { t } = useTranslation();

  const watchSchedule = useWatch({
    name: 'schedule',
    control: form.control,
  });

  return (
    <UI.Grid
      gridTemplateColumns="1fr 1fr"
      p={2}
      borderRadius="6px"
      border="1px solid #edf2f7"
      backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
    >
      <UI.FormControl>
        <UI.FormLabel htmlFor="schedule.frequency">{t('automation:frequency')}</UI.FormLabel>
        <UI.InputHelper>{t('automation:frequency_helper')}</UI.InputHelper>
        <Controller
          name="schedule.frequency"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <UI.Div>
              <Select.Root
                value={value}
                onValueChange={onChange}
                defaultValue={value}
              >
                <Select.SelectTrigger
                  aria-label="schedule frequency"
                >
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
                    <Select.SelectGroup>

                      <Select.SelectItem value={CustomRecurringType.YEARLY}>
                        <Select.SelectItemText>{t('automation:yearly')}</Select.SelectItemText>
                        <Select.SelectItemIndicator>
                          <CheckIcon />
                        </Select.SelectItemIndicator>
                      </Select.SelectItem>

                      <Select.SelectItem value={CustomRecurringType.MONTHLY}>
                        <Select.SelectItemText>{t('automation:monthly')}</Select.SelectItemText>
                        <Select.SelectItemIndicator>
                          <CheckIcon />
                        </Select.SelectItemIndicator>
                      </Select.SelectItem>

                      <Select.SelectItem value={CustomRecurringType.WEEKLY}>
                        <Select.SelectItemText>{t('automation:weekly')}</Select.SelectItemText>
                        <Select.SelectItemIndicator>
                          <CheckIcon />
                        </Select.SelectItemIndicator>
                      </Select.SelectItem>

                      <Select.SelectItem value={CustomRecurringType.DAILY}>
                        <Select.SelectItemText>{t('automation:daily')}</Select.SelectItemText>
                        <Select.SelectItemIndicator>
                          <CheckIcon />
                        </Select.SelectItemIndicator>
                      </Select.SelectItem>

                    </Select.SelectGroup>
                  </Select.SelectViewport>
                  <Select.SelectScrollDownButton>
                    <ChevronDownIcon />
                  </Select.SelectScrollDownButton>
                </Select.SelectContent>
              </Select.Root>
            </UI.Div>
          )}
        />
      </UI.FormControl>
      <UI.FormControl>
        <UI.FormLabel htmlFor="schedule.time">{t('automation:time')}</UI.FormLabel>
        <UI.InputHelper>{t('automation:time_helper')}</UI.InputHelper>
        <Controller
          name="schedule.time"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <TimePickerContent value={value} onChange={onChange} />
          )}
        />
      </UI.FormControl>

      {RecurringPeriodType.Custom && watchSchedule.frequency === CustomRecurringType.DAILY && (
        <UI.FormControl>
          <UI.FormLabel htmlFor="schedule.dayRange">{t('automation:days')}</UI.FormLabel>
          <UI.InputHelper>{t('automation:days_helper')}</UI.InputHelper>
          <Controller
            name="schedule.dayRange"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <DayPicker value={value as any} onChange={onChange} />
            )}
          />
        </UI.FormControl>
      )}

    </UI.Grid>
  );
};
