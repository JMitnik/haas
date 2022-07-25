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

  /**
   * Cache dialogue statistics data when switching between date filters.
   * */
  const [
    cachedDialogueCustomer,
    setCachedDialogueCustomer,
  ] = useState<GetDialogueStatisticsQuery['customer'] | undefined>(undefined);

  const { data, loading } = useGetDialogueStatisticsQuery({
    variables: {
      dialogueSlug,
      customerSlug,
      statisticsDateFilter: {
        startDate: startDate.toISOString(),
      },
      prevDateFilter: {
        endDate: compareStatisticStartDate.toISOString(),
      },
    },
    pollInterval: 5000,
  });

  console.log('Data: ', data?.customer);

  useEffect(() => {
    if (data && !loading) {
      setCachedDialogueCustomer(data?.customer);
    }
  }, [data, loading]);

  if (!cachedDialogueCustomer) return <UI.Loader />;
  const { dialogue } = cachedDialogueCustomer;

  const increaseInAverageScore = calcScoreIncrease(
    dialogue?.thisWeekAverageScore || 0,
    dialogue?.previousScore || 0,
  );

  const makeSearchUrl = () => {
    if (!dialogue?.statistics?.mostPopularPath?.answer) return '';

    return qs.stringify({ search: dialogue?.statistics?.mostPopularPath?.answer });
  };

  const fetchStatus = {
    isRefreshing: loading && !!dialogue,
    isLoading: loading,
  };

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.DeprecatedViewTitle leftIcon={<ChartbarIcon />}>
              {`${t('report:name')}: ${customerSlug} - ${dialogueSlug} (${addWeeks(compareStatisticStartDate, 1).toLocaleDateString()} - ${addWeeks(startDate, 1).toLocaleDateString()})`}
            </UI.DeprecatedViewTitle>
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

            <UI.Grid gridTemplateColumns="repeat(auto-fit, minmax(275px, 1fr))" minHeight="100px">
              <UI.Skeleton {...fetchStatus}>
                <SummaryModule
                  heading={t('interactions')}
                  renderIcon={Activity}
                  onClick={() => (
                    history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)
                  )}
                  isInFallback={dialogue?.statistics?.nrInteractions === 0}
                  fallbackMetric={t('dialogue:fallback_no_interactions')}
                  renderMetric={`${dialogue?.statistics?.nrInteractions} ${dialogue?.statistics?.nrInteractions || 0 > 1 ? t('interactions') : t('interaction')}`}
                />
              </UI.Skeleton>

              <UI.Skeleton {...fetchStatus}>

                <SummaryModule
                  heading={t('dialogue:average_score')}
                  renderIcon={Award}
                  isInFallback={dialogue?.thisWeekAverageScore === 0}
                  fallbackMetric={t('dialogue:fallback_no_score')}
                  renderMetric={`${(dialogue?.thisWeekAverageScore || 0 / 10).toFixed(2)} ${t('score')}`}
                  renderCornerMetric={(
                    <UI.Flex color="red">
                      {increaseInAverageScore > 0 ? (
                        <>
                          <UI.Icon size="22px" as={TrendingUp} color="green.200" />
                          <UI.Text fontWeight={600} fontSize="0.9rem" ml={1} color="green.400">
                            {increaseInAverageScore.toFixed(2)}
                            {' '}
                            %
                          </UI.Text>
                        </>
                      ) : (
                        <>
                          <UI.Icon size="22px" as={TrendingDown} color="red.200" />
                          <UI.Text fontWeight={600} fontSize="0.9rem" ml={1} color="red.400">
                            {increaseInAverageScore.toFixed(2)}
                            {' '}
                            %
                          </UI.Text>
                        </>
                      )}
                    </UI.Flex>
                  )}
                />
              </UI.Skeleton>

              <UI.Skeleton {...fetchStatus}>
                <SummaryModule
                  heading={t('dialogue:frequently_mentioned')}
                  renderIcon={MessageCircle}
                  renderFooterText={t('dialogue:view_all_mentions')}
                  isInFallback={!dialogue?.statistics?.mostPopularPath}
                  onClick={() => (
                    history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions?${makeSearchUrl()}`)
                  )}
                  fallbackMetric={t('dialogue:fallback_no_keywords')}
                  renderMetric={dialogue?.statistics?.mostPopularPath?.answer}
                  renderCornerMetric={(
                    <>
                      {dialogue?.statistics?.mostPopularPath?.basicSentiment === 'positive' ? (
                        <Tag size="sm" variantColor="green">
                          <TagIcon icon={() => <ThumbsUp />} size="10px" color="green.600" />
                          <TagLabel color="green.600">{dialogue?.statistics?.mostPopularPath?.quantity}</TagLabel>
                        </Tag>
                      ) : (
                        <Tag size="sm" variantColor="red">
                          <TagIcon icon={() => <ThumbsDown />} size="10px" color="red.600" />
                          <TagLabel color="red.600">{dialogue?.statistics?.mostPopularPath?.quantity}</TagLabel>
                        </Tag>
                      )}
                    </>
                  )}
                />
              </UI.Skeleton>
            </UI.Grid>
          </UI.Div>

          <UI.Div mt={2} gridColumn="1 / 4">
            <UI.H4 color="default.darker" mb={4}>
              <UI.Flex>
                <UI.Div width="20px">
                  <PathsIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t(`dialogue:notable_paths_of_${dateLabel}`)}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              <UI.Skeleton {...fetchStatus}>
                <PositivePathsModule positivePaths={dialogue?.statistics?.topPositivePath} />
              </UI.Skeleton>

              <UI.Skeleton {...fetchStatus}>
                <NegativePathsModule negativePaths={dialogue?.statistics?.topNegativePath} />
              </UI.Skeleton>
            </UI.Grid>
          </UI.Div>

          <UI.Div gridColumn="span 3">
            <UI.H4 color="default.darker">
              <UI.Flex>
                <UI.Div width="20px">
                  <TrophyIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t('dialogue:latest_data')}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
          </UI.Div>

          <UI.Div gridColumn="span 3">
            <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '2fr 1fr']}>
              <UI.Div>
                {dialogue?.statistics?.history ? (
                  <UI.Skeleton {...fetchStatus}>
                    {/* @ts-ignore */}
                    <ScoreGraphModule chartData={dialogue?.statistics?.history || []} />
                  </UI.Skeleton>
                ) : (
                  <UI.Div>{t('no_data')}</UI.Div>
                )}
              </UI.Div>
            </UI.Grid>
          </UI.Div>
        </UI.Grid>
      </UI.ViewBody>
    </>
  );
};

export default DialogueReportView;
