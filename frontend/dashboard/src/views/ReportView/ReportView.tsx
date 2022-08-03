import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ReactComponent as ChartbarIcon } from 'assets/icons/icon-chartbar.svg';

import { useNavigator } from 'hooks/useNavigator';

type ActiveDateType = 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'last_year';

interface ReportViewInput {
  startDate: Date;
  compareStatisticStartDate: Date;
  dateLabel: ActiveDateType;
}

export const ReportView = ({ compareStatisticStartDate, startDate }: ReportViewInput) => {
  const { dialogueSlug } = useNavigator();
  const { t } = useTranslation();

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.DeprecatedViewTitle leftIcon={<ChartbarIcon />}>
              {`${t('report:name')}: ${dialogueSlug} (${compareStatisticStartDate.toLocaleDateString()} - ${startDate.toLocaleDateString()})`}
            </UI.DeprecatedViewTitle>
          </UI.Flex>
        </UI.Flex>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Div>Ohaiiooooooo</UI.Div>
      </UI.ViewBody>
    </>
  );
};

export default ReportView;
