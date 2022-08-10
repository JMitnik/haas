import * as UI from '@haas/ui';
import {
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { addMonths, addWeeks, addYears, format, parse, sub } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { View } from 'layouts/View';
import { addDays } from 'date-fns/esm';
import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';

type ActiveDateType = 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'last_year';

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ReportViewInput {
  startDate: Date;
  compareStatisticStartDate: Date;
  dateLabel: ActiveDateType;
}

const useOffset = (type: PeriodType) => {
  const now = new Date();
  switch (type) {
    case 'daily':
      return {
        startDate: sub(now, { days: 1 }),
        compareStatisticStartDate: sub(now, { days: 2 }),
        offsetStartDate: now.toLocaleDateString(),
        offsetCompareStatisticStartDate: sub(now, { days: 1 }).toLocaleDateString(),
      };
    case 'monthly':
      return {
        startDate: sub(now, { months: 1 }),
        compareStatisticStartDate: sub(now, { months: 2 }),
        offsetStartDate: now.toLocaleDateString(),
        offsetCompareStatisticStartDate: sub(now, { months: 1 }).toLocaleDateString(),
      };
    case 'yearly':
      return {
        startDate: sub(now, { years: 1 }),
        compareStatisticStartDate: sub(now, { years: 2 }),
        offsetStartDate: now.toLocaleDateString(),
        offsetCompareStatisticStartDate: sub(now, { years: 1 }).toLocaleDateString(),
      };
    case 'weekly':
    default:
      return {
        startDate: sub(now, { weeks: 1 }),
        compareStatisticStartDate: sub(now, { weeks: 2 }),
        offsetStartDate: now.toLocaleDateString(),
        offsetCompareStatisticStartDate: sub(now, { weeks: 1 }).toLocaleDateString(),
      };
  }
};

export const WorkspaceReportView = ({ dateLabel }: ReportViewInput) => {
  const { customerSlug } = useNavigator();
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const [filter] = useQueryParams({
    type: withDefault(StringParam, 'weekly'),
  });

  const offsetDates = useOffset(
    filter.type as PeriodType,
  );

  return (
    <View documentTitle="Reports">
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle>
              {`${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)} ${t('report:name')}: ${customerSlug} (${offsetDates.offsetCompareStatisticStartDate} - ${offsetDates.offsetStartDate})`}
            </UI.ViewTitle>
          </UI.Flex>
        </UI.Flex>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}>
          <UI.Div gridColumn="1 / 4">
            <UI.H4 color="default.darker" mb={4}>
              <UI.Flex>
                <UI.Div width="20px">
                  <TrendingIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t(`dialogue:${dateLabel}_summary`)}
                </UI.Span>
              </UI.Flex>
            </UI.H4>

          </UI.Div>

        </UI.Grid>
      </UI.ViewBody>
    </View>
  );
};

export default WorkspaceReportView;
