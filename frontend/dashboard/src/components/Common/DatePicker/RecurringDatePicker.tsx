import * as UI from '@haas/ui';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import React from 'react';

import * as Select from 'components/Common/Select';
import { CustomRecurringType } from 'views/AddAutomationView/AutomationForm.types';
import { useTranslation } from 'react-i18next';

interface RecurringDatePickerProps {
  value: any;
  onChange: (value: any) => void;
}

export const RecurringDatePicker = ({ value = CustomRecurringType.WEEKLY, onChange } : RecurringDatePickerProps) => {
  const { t } = useTranslation();

  return (
    <UI.Div position="relative">
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
  );
};
