import * as UI from '@haas/ui';
import * as qs from 'qs';
import {
  Activity, Award, MessageCircle,
  ThumbsDown, ThumbsUp, TrendingDown, TrendingUp,
} from 'react-feather';
import { Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { ReactComponent as ChartbarIcon } from 'assets/icons/icon-chartbar.svg';
import { GetDialogueStatisticsQuery, useGetDialogueStatisticsQuery } from 'types/generated-types';
import { ReactComponent as PathsIcon } from 'assets/icons/icon-launch.svg';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/icon-trophy.svg';

import { addWeeks } from 'date-fns';
import { useNavigator } from 'hooks/useNavigator';
import NegativePathsModule from 'views/DialogueView/Modules/NegativePathsModule/NegativePathsModule';
import PositivePathsModule from 'views/DialogueView/Modules/PositivePathsModule';
import ScoreGraphModule from 'views/DialogueView/Modules/ScoreGraphModule';
import SummaryModule from 'views/DialogueView/Modules/SummaryModules/SummaryModule';
import { View } from 'layouts/View';

type ActiveDateType = 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'last_year';

const calcScoreIncrease = (currentScore: number, prevScore: number) => {
  if (!prevScore) return 100;

  return currentScore / prevScore || 0;
};

interface ReportViewInput {
  startDate: Date;
  compareStatisticStartDate: Date;
  dateLabel: ActiveDateType;
}

export const DialogueReportView = ({ compareStatisticStartDate, dateLabel, startDate }: ReportViewInput) => {
  const { dialogueSlug, customerSlug } = useNavigator();
  const history = useHistory();
  const { t } = useTranslation();

  // /**
  //  * Cache dialogue statistics data when switching between date filters.
  //  * */
  // const [
  //   cachedDialogueCustomer,
  //   setCachedDialogueCustomer,
  // ] = useState<GetDialogueStatisticsQuery['customer'] | undefined>(undefined);

  // const { data, loading } = useGetDialogueStatisticsQuery({
  //   variables: {
  //     dialogueSlug,
  //     customerSlug,
  //     statisticsDateFilter: {
  //       startDate: startDate.toISOString(),
  //     },
  //     prevDateFilter: {
  //       endDate: compareStatisticStartDate.toISOString(),
  //     },
  //   },
  //   pollInterval: 5000,
  // });

  // console.log('Data: ', data?.customer);

  // useEffect(() => {
  //   if (data && !loading) {
  //     setCachedDialogueCustomer(data?.customer);
  //   }
  // }, [data, loading]);

  // if (!cachedDialogueCustomer) return <UI.Loader />;
  // const { dialogue } = cachedDialogueCustomer;

  return (
    <View documentTitle='Report'>
    <UI.ViewHead>
        <UI.ViewTitle>
          <UI.Flex justifyContent="space-between">
            <UI.Div>
              Weekly report
            </UI.Div>

            <UI.Div>
              Week
            </UI.Div>
          </UI.Flex>
        </UI.ViewTitle>
      </UI.ViewHead>
      <UI.ViewBody>
        tet
      </UI.ViewBody>
    </View>
  );
};

export default DialogueReportView;
