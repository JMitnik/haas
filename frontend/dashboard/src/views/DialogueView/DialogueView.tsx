import * as UI from '@haas/ui';
import * as qs from 'qs';
import {
  Activity, Award, MessageCircle,
  ThumbsDown, ThumbsUp, TrendingDown, TrendingUp,
} from 'react-feather';
import { Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { startOfMonth, startOfWeek, startOfYear, sub } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useReducer, useState } from 'react';

import { ReactComponent as ChartbarIcon } from 'assets/icons/icon-chartbar.svg';
import {
  GetDialogueStatisticsQuery,
  useGetDialogueStatisticsQuery,
  useGetDialogueStatisticsSummaryQuery,
} from 'types/generated-types';
import { ReactComponent as PathsIcon } from 'assets/icons/icon-launch.svg';
import { ReactComponent as QRIcon } from 'assets/icons/icon-qr.svg';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/icon-trophy.svg';
import { useDialogue } from 'providers/DialogueProvider';
import { useNavigator } from 'hooks/useNavigator';
import Dropdown from 'components/Dropdown';

import { ChoiceSummaryModule } from './Modules/ChoiceSummaryModule';
import { PathSummaryModule } from './Modules/PathSummaryModule';
import { ShareModal } from './ShareModal';
import InteractionFeedModule from './Modules/InteractionFeedModule/InteractionFeedModule';
import ScoreGraphModule from './Modules/ScoreGraphModule';
import SummaryModule from './Modules/SummaryModules/SummaryModule';

type ActiveDateType = 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'last_year';
type Groupby = 'minute' | 'hour' | 'day' | 'week';

interface ActiveDateState {
  dateLabel: ActiveDateType;
  startDate: Date;
  groupBy: Groupby;
  compareStatisticStartDate: Date;
}

interface ActiveDateAction {
  type: ActiveDateType;
}

const dateReducer = (state: ActiveDateState, action: ActiveDateAction): ActiveDateState => {
  switch (action.type) {
    case 'last_hour':
      return {
        startDate: sub(new Date(), { hours: 1 }),
        compareStatisticStartDate: sub(new Date(), { hours: 2 }),
        groupBy: 'minute',
        dateLabel: 'last_hour',
      };

    case 'last_day':
      return {
        startDate: sub(new Date(), { hours: 24 }),
        compareStatisticStartDate: sub(new Date(), { days: 2 }),
        groupBy: 'hour',
        dateLabel: 'last_day',
      };
    case 'last_month':
      return {
        startDate: sub(new Date(), { months: 1 }),
        compareStatisticStartDate: sub(new Date(), { months: 2 }),
        groupBy: 'day',
        dateLabel: 'last_month',
      };
    case 'last_week':
      return {
        startDate: sub(new Date(), { weeks: 1 }),
        compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
        groupBy: 'day',
        dateLabel: 'last_week',
      };
    case 'last_year':
      return {
        startDate: sub(new Date(), { years: 1 }),
        compareStatisticStartDate: sub(new Date(), { years: 2 }),
        groupBy: 'week',
        dateLabel: 'last_year',
      };
    default:
      return {
        startDate: sub(new Date(), { weeks: 1 }),
        compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
        groupBy: 'day',
        dateLabel: 'last_month',
      };
  }
};

const calcScoreIncrease = (currentScore: number, prevScore: number) => {
  if (!prevScore) return 100;

  return currentScore / prevScore || 0;
};

const DialogueView = () => {
  const [activeDateState] = useReducer(dateReducer, {
    startDate: sub(new Date(), { weeks: 1 }),
    compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
    dateLabel: 'last_week',
    groupBy: 'day',
  });
  const [[startDate, endDate], setDateRange] = useState([startOfWeek(new Date()), new Date()]);
  const { dialogueSlug, customerSlug, getDialoguesPath } = useNavigator();
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
        startDate: startDate ? startDate.toISOString() : undefined,
      },
      prevDateFilter: {
        endDate: endDate ? endDate.toISOString() : undefined,
      },
    },
    pollInterval: 5000,
  });

  const { activeDialogue } = useDialogue();

  const { data: summaryData, loading: summaryLoading } = useGetDialogueStatisticsSummaryQuery({
    variables: {
      dialogueId: activeDialogue?.id || '',
      filter: {
        startDate: startDate ? startDate.getTime() : undefined,
        endDate: endDate ? endDate.getTime() : undefined,
      },
      // @ts-ignore
      sessionGroupby: activeDateState.groupBy,
    },
  });

  const statisticsSummary = summaryData?.dialogue?.statistics?.statisticsSummary;
  const sessionsSummaries = statisticsSummary?.sessionsSummaries;
  const choicesSummaries = statisticsSummary?.choicesSummaries;
  const pathSummary = statisticsSummary?.pathsSummary;

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

  const shareUrl = `https://client.haas.live/${customerSlug}/${dialogueSlug}`;

  const fetchStatus = {
    isRefreshing: loading && !!dialogue,
    isLoading: loading,
  };

  return (
    <>
      <UI.ViewHead renderBreadCrumb={<UI.Breadcrumb to={getDialoguesPath()}>{t('go_to_dialogues')}</UI.Breadcrumb>}>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle leftIcon={<ChartbarIcon />}>
              {t('views:dialogue_view')}
            </UI.ViewTitle>
            <Dropdown
              renderOverlay={() => <ShareModal dialogueName={dialogueSlug} shareUrl={shareUrl} />}
            >
              {({ onOpen }) => (
                <UI.Button onClick={onOpen} variantColor="teal" leftIcon={QRIcon} ml={4} size="sm">
                  {t('share')}
                </UI.Button>
              )}
            </Dropdown>
          </UI.Flex>

          <UI.Flex justifyContent="space-between" flexWrap="wrap">
            <UI.DatePicker
              defaultValue={[startDate, endDate]}
              range
              // @ts-ignore
              ranges={{
                Today: [new Date(), new Date()],
                'This Week': [startOfWeek(new Date()), new Date()],
                'This Month': [startOfMonth(new Date()), new Date()],
                'This Year': [startOfYear(new Date()), new Date()],
              }}
              onChange={(dates: [Date, Date]) => setDateRange(dates)}
            />
          </UI.Flex>
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Grid>
          <UI.Div>
            <UI.H4 color="default.darker">
              <UI.Flex>
                <UI.Div width="20px">
                  <TrendingIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t(`dialogue:${activeDateState.dateLabel}_summary`)}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
          </UI.Div>

          <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']} minHeight="100px">
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
                        <TagIcon icon={ThumbsUp} size="10px" color="green.600" />
                        <TagLabel color="green.600">{dialogue?.statistics?.mostPopularPath?.quantity}</TagLabel>
                      </Tag>
                    ) : (
                      <Tag size="sm" variantColor="red">
                        <TagIcon icon={ThumbsDown} size="10px" color="red.600" />
                        <TagLabel color="red.600">{dialogue?.statistics?.mostPopularPath?.quantity}</TagLabel>
                      </Tag>
                    )}
                  </>
                  )}
              />
            </UI.Skeleton>
          </UI.Grid>
          <UI.Div>
            <UI.H4 color="default.darker" mb={4}>
              <UI.Flex>
                <UI.Div width="20px">
                  <PathsIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t(`dialogue:notable_paths_of_${activeDateState.dateLabel}`)}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              <UI.Skeleton {...fetchStatus}>
                <ChoiceSummaryModule data={choicesSummaries || []} />
              </UI.Skeleton>

              <UI.Skeleton {...fetchStatus}>
                <UI.Card />
                <PathSummaryModule data={pathSummary} />
              </UI.Skeleton>
            </UI.Grid>
          </UI.Div>

          <UI.Div>
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

          <UI.Div>
            <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '2fr 1fr']}>
              <UI.Div>
                <UI.Skeleton isLoading={summaryLoading}>
                  <ScoreGraphModule chartData={sessionsSummaries || []} />
                </UI.Skeleton>
              </UI.Div>

              <UI.Skeleton {...fetchStatus}>
                {/* @ts-ignore */}
                <InteractionFeedModule interactions={dialogue?.sessions || []} />
              </UI.Skeleton>
            </UI.Grid>
          </UI.Div>
        </UI.Grid>

      </UI.ViewBody>
    </>
  );
};

export default DialogueView;
