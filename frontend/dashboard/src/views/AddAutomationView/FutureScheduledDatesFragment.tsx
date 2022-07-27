import * as UI from '@haas/ui';
import { Clock } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { Switch, SwitchThumb } from 'components/Common/Switch';

import { DEPTH_BACKGROUND_COLORS } from './AutomationForm.constants';

interface FutureScheduledDatesFragmentProps {
  futureDates?: Date[];
}

export const FutureScheduledDatesFragment = ({ futureDates }: FutureScheduledDatesFragmentProps) => {
  const { t } = useTranslation();
  const { format, formatUTC } = useDate();
  const [isLocalTime, setisLocalTime] = useState(true);

  return (
    <UI.Grid
      p={2}
      borderRadius="6px"
      border="1px solid #edf2f7"
      backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      gridGap="0 1em"
    >
      <UI.Flex gridColumn="1/-1" justifyContent="space-between">
        <UI.H4 color="default.text" fontWeight={500} pb={2}>{t('automation:future_dates')}</UI.H4>
        <UI.Flex>
          <UI.Text mr={2}>{t('automation:show_local_time')}</UI.Text>
          <Switch
            isChecked={isLocalTime}
            onChange={() => setisLocalTime((prev) => !prev)}
          >
            <SwitchThumb />
          </Switch>
        </UI.Flex>
      </UI.Flex>
      {futureDates?.map((entry, index) => (
        <UI.Flex key={entry.toString()} alignItems="center" pb={1}>
          <UI.Div padding="1em" mr={1} paddingLeft="0" position="relative">
            <UI.Icon color="main.500">
              <Clock width="1.5em" />
              <UI.Div position="absolute" bottom={5} right={5}>
                {index + 1}
              </UI.Div>
            </UI.Icon>
          </UI.Div>
          <UI.Div>
            <UI.Div>
              <UI.Text>
                {isLocalTime
                  ? format(entry, DateFormat.Time)
                  : formatUTC(entry, DateFormat.Time)}
              </UI.Text>
              <UI.Text>
                {isLocalTime
                  ? format(entry, DateFormat.MonthDate)
                  : formatUTC(entry, DateFormat.MonthDate)}
              </UI.Text>
            </UI.Div>
          </UI.Div>

        </UI.Flex>
      ))
        || <UI.Span>{t('automation:no_future_dates_available')}</UI.Span>}

    </UI.Grid>
  );
};
