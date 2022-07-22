import * as UI from '@haas/ui';
import {
  ArrayParam,
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { addWeeks } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { useNavigator } from 'hooks/useNavigator';

type ActiveDateType = 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'last_year';

interface ReportViewInput {
  startDate: Date;
  compareStatisticStartDate: Date;
  dateLabel: ActiveDateType;
}

export const WorkspaceReportView = ({ compareStatisticStartDate, dateLabel, startDate }: ReportViewInput) => {
  const { customerSlug } = useNavigator();
  const { t } = useTranslation();

  const [filter, setFilter] = useQueryParams({
    type: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    workspaceId: StringParam,
  });

  console.log('Filter: ', filter);

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle>
              {`${t('report:name')}: ${customerSlug} - (${addWeeks(compareStatisticStartDate, 1).toLocaleDateString()} - ${addWeeks(startDate, 1).toLocaleDateString()})`}
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
