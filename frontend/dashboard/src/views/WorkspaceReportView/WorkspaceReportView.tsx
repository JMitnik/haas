import * as UI from '@haas/ui';
import { isPresent } from 'ts-is-present';
import React, { } from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { DialogueImpactScoreType, useGetIssuesQuery, useGetWorkspaceReportQuery } from 'types/generated-types';
import { EventBars } from 'components/Analytics/Common/EventBars';
import { ReactComponent as RankingThumbnail } from 'assets/images/thumbnails/sm/rounded-ranking.svg';
import { ReportsHeader, ReportsLayout } from 'layouts/ReportsLayout/ReportsLayout';
import { ScoreBox } from 'components/ScoreBox';
import { ReactComponent as TopicsThumbnail } from 'assets/images/thumbnails/sm/rounded-topics.svg';
import { User } from 'react-feather';
import { ReactComponent as UsersThumbnail } from 'assets/images/thumbnails/sm/rounded-users.svg';
import { View } from 'layouts/View';
import { sumBy } from 'lodash';
import { useCustomer } from 'providers/CustomerProvider';
import { useTranslation } from 'react-i18next';
import mainTheme from 'config/theme';
import useMeasure from 'react-use-measure';

export const WorkspaceReportView = () => {
  const { activeCustomer } = useCustomer();
  const { format, getNWeekAgo, getStartOfWeek, getEndOfWeek } = useDate();
  const { t } = useTranslation(['general', 'reporting']);

  const relevantWeek = getNWeekAgo(0);
  const startDate = getStartOfWeek(relevantWeek);
  const endDate = getEndOfWeek(new Date());

  const [ref, bounds] = useMeasure();

  const { data: d, loading: loadingReport } = useGetWorkspaceReportQuery({
    variables: {
      workspaceId: activeCustomer?.id || '',
      filter: {
        impactType: DialogueImpactScoreType.Average,
        startDateTime: format(startDate, DateFormat.DayTimeFormat),
        endDateTime: format(endDate, DateFormat.DayTimeFormat),
        refresh: true,
      },
      issueFilter: {
        startDate: format(startDate, DateFormat.DayTimeFormat),
        endDate: format(endDate, DateFormat.DayTimeFormat),
        dialogueStrings: [],
        topicStrings: [],
      },
    },
  });

  const { data: issuesData, loading: loadingIssues } = useGetIssuesQuery({
    variables: {
      workspaceId: activeCustomer?.id || '',
      filter: {
        startDate: format(startDate, DateFormat.DayTimeFormat),
        endDate: format(endDate, DateFormat.DayTimeFormat),
        dialogueStrings: [],
        topicStrings: [],
      },
    },
  });

  const responseHistogramItems = d?.customer?.statistics?.responseHistogram?.items || [];
  const basicStatistics = d?.customer?.statistics?.basicStats || undefined;
  const issueHistogramItems = d?.customer?.statistics?.issueHistogram?.items || [];

  const issuesCount = sumBy(d?.customer?.statistics?.issueHistogram?.items, (item) => item.frequency);

  const issues = issuesData?.customer?.issues || [];
  const topics = d?.customer?.issueTopics || [];

  const isLoading = loadingReport || loadingIssues;

  if (isLoading) {
    return <UI.Loader />;
  }

  return (
    <ReportsLayout>
      <View documentTitle="Report">
        <ReportsHeader>
          <UI.ViewHead>
            <UI.ViewTitle>
              <UI.Flex justifyContent="space-between">
                <UI.Div>
                  {t('weekly_report')}
                </UI.Div>

                <UI.Div>
                  <UI.Span color="off.500" fontSize="1.4rem">
                    {format(startDate, DateFormat.DayFormat)}
                    {' - '}
                    {format(endDate, DateFormat.DayFormat)}
                  </UI.Span>
                </UI.Div>
              </UI.Flex>
            </UI.ViewTitle>
          </UI.ViewHead>
        </ReportsHeader>
        <UI.ViewBody>
          <UI.Grid mt={24} gridGap={48}>
            <UI.Flex>
              <UI.Thumbnail size="sm" mr={3}>
                <UsersThumbnail />
              </UI.Thumbnail>
              <UI.Div>
                <UI.H3 mb={1} lineHeight={1} color="off.600">
                  {t('responses')}
                </UI.H3>

                <UI.Span fontSize="1.1rem" color="off.500">
                  {t('reporting:responses_helper')}
                </UI.Span>
              </UI.Div>
            </UI.Flex>
            <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '1fr 1fr']}>
              <UI.Card>
                <UI.CardBody _size="lg">
                  <UI.Flex justifyContent="space-between">
                    <UI.H3 color="off.600" fontWeight={700}>{t('total_responses')}</UI.H3>
                    <UI.H3 lineHeight={1} mt={1} mb={1} color="off.500" fontWeight={700}>
                      {basicStatistics?.responseCount}
                    </UI.H3>
                  </UI.Flex>
                </UI.CardBody>
                <UI.CardBody _size="lg">
                  <UI.Div ref={ref}>
                    <EventBars
                      id="responses"
                      width={bounds.width}
                      height={200}
                      startDate={startDate}
                      endDate={endDate}
                      tickFormat={DateFormat.DayFormat}
                      showFrequency
                      events={responseHistogramItems}
                    />
                  </UI.Div>
                </UI.CardBody>
              </UI.Card>
              <UI.Card>
                <UI.CardBody _size="lg">
                  <UI.Flex justifyContent="space-between">
                    <UI.H3 color="off.600" fontWeight={700}>{t('total_problems')}</UI.H3>
                    <UI.H3 lineHeight={1} mt={1} mb={1} color="off.500" fontWeight={700}>
                      {issuesCount}
                    </UI.H3>
                  </UI.Flex>
                </UI.CardBody>
                <UI.CardBody _size="lg">
                  <UI.Div ref={ref}>
                    <EventBars
                      id="issues"
                      width={bounds.width}
                      height={200}
                      startDate={startDate}
                      fill={mainTheme.colors.red[200]}
                      endDate={endDate}
                      tickFormat={DateFormat.DayFormat}
                      showFrequency
                      events={issueHistogramItems}
                    />
                  </UI.Div>
                </UI.CardBody>
              </UI.Card>
            </UI.Grid>
            <UI.Div>
              <UI.Flex>
                <UI.Thumbnail size="sm" mr={3}>
                  <img width={60} height={60} src="/assets/images/thumbnails/rounded-ranking.svg" />
                  {/* <RankingThumbnail /> */}
                </UI.Thumbnail>
                <UI.Div>
                  <UI.H3 mb={1} lineHeight={1} color="off.600">
                    {t('trending_teams')}
                  </UI.H3>

                  <UI.Span fontSize="1.1rem" color="off.500">
                    {t('reporting:trending_teams_helper')}
                  </UI.Span>
                </UI.Div>
              </UI.Flex>
            </UI.Div>
            <UI.Div>
              <UI.Card>
                <UI.CardHeader>
                  <UI.Grid gridTemplateColumns="50px 2fr 1fr 1fr 200px">
                    <UI.Div>
                      <UI.Helper>{t('score')}</UI.Helper>
                    </UI.Div>
                    <UI.Div>
                      <UI.Helper>{t('team')}</UI.Helper>
                    </UI.Div>
                    <UI.Div>
                      <UI.Helper>{t('responses')}</UI.Helper>
                    </UI.Div>
                    <UI.Div>
                      <UI.Helper>{t('action_requests')}</UI.Helper>
                    </UI.Div>
                    <UI.Div>
                      <UI.Helper>{t('pulse')}</UI.Helper>
                    </UI.Div>
                  </UI.Grid>
                </UI.CardHeader>
                <UI.CardBody>
                  {issues.filter(isPresent).map((issue) => (
                    <UI.Grid gridTemplateColumns="50px 2fr 1fr 1fr 200px" style={{ alignItems: 'center' }}>
                      <UI.Div>
                        <ScoreBox score={issue.basicStats.average} />
                      </UI.Div>
                      <UI.Div>
                        {issue.dialogue?.title}
                      </UI.Div>
                      <UI.Div>
                        {issue.basicStats.responseCount}
                      </UI.Div>
                      <UI.Div>
                        {issue?.actionRequiredCount}
                      </UI.Div>
                      <UI.Div>
                        <EventBars
                          events={issue.history.items || []}
                          startDate={startDate}
                          endDate={endDate}
                          width={200}
                          height={35}
                        />
                      </UI.Div>
                    </UI.Grid>
                  ))}
                </UI.CardBody>
              </UI.Card>
            </UI.Div>
            <UI.Div>
              <UI.Div>
                <UI.Flex>
                  <UI.Thumbnail size="sm" mr={3}>
                    <TopicsThumbnail />
                  </UI.Thumbnail>
                  <UI.Div>
                    <UI.H3 mb={1} lineHeight={1} color="off.600">
                      {t('trending_topics')}
                    </UI.H3>

                    <UI.Span fontSize="1.1rem" color="off.500">
                      {t('reporting:trending_topics_helper')}
                    </UI.Span>
                  </UI.Div>
                </UI.Flex>
              </UI.Div>

              <UI.Div>
                {topics.filter(isPresent).map((topic) => (
                  <UI.Div>
                    <UI.Grid style={{ alignItems: 'center' }} gridTemplateColumns="70px 1fr 80px">
                      <UI.Div color="off.600">
                        <UI.Flex>
                          <UI.Icon mr={1}>
                            <User />
                          </UI.Icon>
                          {topic?.basicStats.responseCount}
                        </UI.Flex>
                      </UI.Div>

                      <UI.Div>
                        <UI.Strong color="off.600">
                          {topic.topic}
                        </UI.Strong>
                        <br />

                        <UI.Span color="off.400">
                          {'in '}
                          {topic.dialogue?.title}
                        </UI.Span>
                      </UI.Div>

                      <UI.Div>
                        <ScoreBox score={topic.basicStats.average} />
                      </UI.Div>
                    </UI.Grid>
                  </UI.Div>
                ))}
              </UI.Div>
            </UI.Div>
          </UI.Grid>
        </UI.ViewBody>
      </View>
    </ReportsLayout>
  );
};

export default WorkspaceReportView;
