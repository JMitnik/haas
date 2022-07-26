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

const useOffset = (type: PeriodType, startDate: Date, compareStatisticStartDate: Date) => {
  switch (type) {
    case 'daily':
      return {
        startDate: addDays(startDate, 1).toLocaleDateString(),
        compareStatisticStartDate: addDays(compareStatisticStartDate, 1).toLocaleDateString(),
      };
    case 'monthly':
      return {
        startDate: addMonths(startDate, 1).toLocaleDateString(),
        compareStatisticStartDate: addMonths(compareStatisticStartDate, 1).toLocaleDateString(),
      };
    case 'yearly':
      return {
        startDate: addYears(startDate, 1).toLocaleDateString(),
        compareStatisticStartDate: addYears(compareStatisticStartDate, 1).toLocaleDateString(),
      };
    case 'weekly':
    default:
      return {
        startDate: addWeeks(startDate, 1).toLocaleDateString(),
        compareStatisticStartDate: addWeeks(compareStatisticStartDate, 1).toLocaleDateString(),
      };
  }
};

export const WorkspaceReportView = ({ compareStatisticStartDate, dateLabel, startDate }: ReportViewInput) => {
  const { customerSlug } = useNavigator();
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { parse: parseDate, toDayFormat } = useDate();

  const [filter] = useQueryParams({
    type: withDefault(StringParam, 'weekly'),
    startDate: StringParam,
    compareStatisticStartDate: StringParam,
  });

  const queryInput = {
    workspaceId: activeCustomer?.id as string,
    startDate: filter.startDate,
    compareStatisticStartDate: filter.compareStatisticStartDate,
  };

  console.log('Input for potential query: ', queryInput);

  const offsetDates = useOffset(
    filter.type as PeriodType,
    parseDate(filter.startDate || toDayFormat(sub(new Date(), { weeks: 1 })), DateFormat.DayFormat),
    parseDate(filter.compareStatisticStartDate || toDayFormat(sub(new Date(), { weeks: 2 })), DateFormat.DayFormat),
  );

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle>
              {`${t('report:name')}: ${customerSlug} (${offsetDates.compareStatisticStartDate} - ${offsetDates.startDate})`}
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
    </>
  );
};

export default WorkspaceReportView;
