import * as UI from '@haas/ui';
import * as qs from 'qs';
import {
  Activity, Award, MessageCircle,
} from 'react-feather';
import { format, isValid, parse, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { ReactComponent as AnalyticsIll } from 'assets/images/undraw_analytics.svg';
import { ReactComponent as ChartbarIcon } from 'assets/icons/icon-chartbar.svg';
import {
  GetDialogueStatisticsQuery,
  useGetDialogueStatisticsQuery,
  useGetDialogueStatisticsSummaryQuery,
} from 'types/generated-types';
import { ReactComponent as InteractionsIll } from 'assets/images/undraw_interactions.svg';
import { ReactComponent as LikeDislikeIll } from 'assets/images/undraw_like_dislike.svg';
import { ReactComponent as PathsIcon } from 'assets/icons/icon-launch.svg';
import { ReactComponent as QRIcon } from 'assets/icons/icon-qr.svg';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/icon-trophy.svg';
import { useDialogue } from 'providers/DialogueProvider';
import { useNavigator } from 'hooks/useNavigator';
import Dropdown from 'components/Dropdown';
import useLocalStorage from 'hooks/useLocalStorage';

import { ChoiceSummaryModule } from './Modules/ChoiceSummaryModule';
import { Module } from './Modules/Module';
import { PathSummaryModule } from './Modules/PathSummaryModule';
import { ShareModal } from './ShareModal';
import InteractionFeedModule from './Modules/InteractionFeedModule/InteractionFeedModule';
import ScoreGraphModule from './Modules/ScoreGraphModule';
import SummaryModule from './Modules/SummaryModules/SummaryModule';

const isToday = (someDate: Date) => {
  const today = new Date();
  return someDate.getDate() === today.getDate()
    && someDate.getMonth() === today.getMonth()
    && someDate.getFullYear() === today.getFullYear();
};

const calcScoreIncrease = (currentScore: number, prevScore: number) => {
  if (!prevScore) return 100;

  return currentScore / prevScore || 0;
};

const DialogueView = () => {
  const { dialogueSlug, customerSlug, getDialoguesPath } = useNavigator();
  const location = useLocation();

  const [localDateRange, setLocalDateRange] = useLocalStorage<any>(
    `dialogue:${dialogueSlug}:dateRange`,
    JSON.stringify({
      startDate: format(new Date(), 'dd-MM-yyyy'),
      endDate: format(new Date(), 'dd-MM-yyyy'),
    })
  );

  // Get start and end-date of dialogue filter
  const [[startDate, endDate], setDateRange] = useState(() => {
    // These are the default dates if no local-storage has been set
    let startDate = new Date();
    let endDate = new Date();

    // First parse local-stored dates
    const { startDate: startDateLocal, endDate: endDateLocal } = JSON.parse(localDateRange);
    const parsedStartDateLocal = parse(startDateLocal, 'dd-MM-yyyy', new Date());
    const parsedEndDateLocal = parse(endDateLocal, 'dd-MM-yyyy', new Date());

    if (isValid(parsedStartDateLocal)) {
      startDate = parsedStartDateLocal;
    }

    if (isValid(parsedEndDateLocal)) {
      endDate = parsedEndDateLocal;
    }

    const urlParams = qs.parse(location.search, { ignoreQueryPrefix: true });

    // If URL param is set, override it
    const parsedStartDate = parse(urlParams?.startDate as string, 'dd-MM-yyyy', new Date());
    if (isValid(parsedStartDate)) {
      startDate = parsedStartDate;
    }

    const parsedEndDate = parse(urlParams?.endDate as string, 'dd-MM-yyyy', new Date());
    if (isValid(parsedEndDate)) {
      endDate = parsedEndDate;
    }

    return [startDate, endDate];
  });

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (startDate && endDate) {
      const startDateString = format(startDate, 'dd-MM-yyyy');
      const endDateString = format(endDate, 'dd-MM-yyyy');
      const dateUrl = qs.stringify({
        startDate: startDateString,
        endDate: endDateString,
      });

      history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}?${dateUrl}`);

      setLocalDateRange(JSON.stringify({
        startDate: startDateString,
        endDate: endDateString
      }));
    }
  }, [startDate, endDate, setDateRange]);

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
      sessionGroupby: undefined,
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

  const makeSearchUrl = () => {
    if (!dialogue?.statistics?.mostPopularPath?.answer) return '';

    return qs.stringify({ search: dialogue?.statistics?.mostPopularPath?.answer });
  };

  const shareUrl = `https://client.haas.live/${customerSlug}/${dialogueSlug}`;

  const fetchStatus = {
    isRefreshing: loading && !!dialogue,
    isLoading: loading,
  };

  const fetchSummaryStatus = {
    isRefrehsing: summaryLoading,
    isLoading: summaryLoading,
  };

  const humanStartDate = format(startDate, 'LLL do yyyy');
  const humanEndDate = isToday(endDate) ? 'today': format(endDate, 'LLL do yyyy');

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
                  {t('trends_between_dates', {
                    startDate: humanStartDate,
                    endDate: humanEndDate
                  })}
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
                  {t('interactions_between_dates', {
                    startDate: humanStartDate,
                    endDate: humanEndDate
                  })}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              <Module
                {...fetchSummaryStatus}
                isEmpty={!choicesSummaries?.length}
                fallbackText={t('no_choices_made_yet', { startDate: humanStartDate, endDate: humanEndDate })}
              >
                <ChoiceSummaryModule data={choicesSummaries || []} />
              </Module>
              <Module
                {...fetchSummaryStatus}
                isEmpty={!pathSummary?.mostCriticalPath}
                fallbackIllustration={<LikeDislikeIll />}
                fallbackText={t('no_journeys_made_yet', { startDate: humanStartDate, endDate: humanEndDate })}
              >
                {!!pathSummary?.mostCriticalPath && (
                  // @ts-ignore
                  <PathSummaryModule data={pathSummary} />
                )}
              </Module>
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
                <Module
                  {...fetchSummaryStatus}
                  isEmpty={!sessionsSummaries?.length}
                  fallbackIllustration={<AnalyticsIll />}
                  fallbackText={t('no_scores_made_yet', { startDate: humanStartDate, endDate: humanEndDate })}
                >
                  <ScoreGraphModule chartData={sessionsSummaries || []} />
                </Module>
              </UI.Div>
              <Module
                {...fetchStatus}
                isEmpty={!dialogue?.sessions?.length}
                fallbackText={t('no_interactions_made')}
                fallbackIllustration={<InteractionsIll />}
              >
                {/* @ts-ignore */}
                <InteractionFeedModule interactions={dialogue?.sessions || []} />
              </Module>
            </UI.Grid>
          </UI.Div>
        </UI.Grid>

      </UI.ViewBody>
    </>
  );
};

export default DialogueView;
