/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import '@szhsin/react-menu/dist/index.css';
import * as UI from '@haas/ui';
import { AlertTriangle, AlignLeft, BarChart2, Calendar, Filter, Plus, Search, User } from 'react-feather';
import {
  ArrayParam,
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { endOfDay, format, startOfDay } from 'date-fns';
import { isPresent } from 'ts-is-present';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Menu from 'components/Common/Menu';
import * as Modal from 'components/Common/Modal';
import * as Table from 'components/Common/Table';
import { DateFormat, useDate } from 'hooks/useDate';
import {
  GetWorkspaceIssuesQuery,
  GetWorkspaceSessions, IssueConnectionOrderType, IssueFragmentFragment,
  SessionConnectionOrder,
  SessionFragmentFragment,
  useGetWorkspaceIssuesQuery,
  useGetWorkspaceSessionsQuery,
} from 'types/generated-types';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { ScoreBox } from 'components/ScoreBox';
import { TabbedMenu } from 'components/Common/TabMenu';
import { View } from 'layouts/View';
import { formatSimpleDate } from 'utils/dateUtils';
import { getMainTopicValue } from 'components/Session/Session.helpers';
import { useCustomer } from 'providers/CustomerProvider';
import { useFormatter } from 'hooks/useFormatter';
import { useMenu } from 'components/Common/Menu/useMenu';
import SearchBar from 'components/Common/SearchBar/SearchBar';

import { ContactableUserCell } from './InteractionTableCells';
import { InteractionModalCard } from '../InteractionsOverview/InteractionModalCard';
import { IssueModalCard } from './IssueModalCard';
import { UrgentContainer } from './IssueOverview.styles';

const DateCell = ({ timestamp }: { timestamp: string }) => {
  const date = new Date(parseInt(timestamp, 10));

  const formattedDate = format(date, 'd MMM yyyy');
  const formattedTimestamp = format(date, 'HH:mm');

  return (
    <UI.ColumnFlex>
      <UI.Helper>{formattedDate}</UI.Helper>
      <UI.Span color="gray.400" fontWeight={600}>{formattedTimestamp}</UI.Span>
    </UI.ColumnFlex>
  );
};

interface DistributionInnerCellProps {
  session: SessionFragmentFragment;
}

const DistributionInnerCell = ({ session }: DistributionInnerCellProps) => (
  <UI.Div>
    <Table.InnerCell>
      <UI.Helper color="gray.500">
        {session.dialogue?.title}
      </UI.Helper>
    </Table.InnerCell>
  </UI.Div>
);

export const IssuesOverview = () => {
  const { t } = useTranslation();
  const { parse, format: dateFormat, getStartOfWeek, getNWeekAgo, getEndOfWeek } = useDate();
  const { activeCustomer } = useCustomer();
  const { formatScore } = useFormatter();

  const [modalIsOpen, setModalIsOpen] = useState({ isOpen: false, issueId: '' });
  const [sessions, setSessions] = useState<SessionFragmentFragment[]>(() => []);
  const [issues, setIssues] = useState<IssueFragmentFragment[]>(() => []);

  const [filter, setFilter] = useQueryParams({
    startDate: withDefault(StringParam, dateFormat(getStartOfWeek(getNWeekAgo(0)), DateFormat.DayTimeFormat)),
    endDate: withDefault(StringParam, dateFormat(getEndOfWeek(new Date()), DateFormat.DayTimeFormat)),
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    orderByField: withDefault(StringParam, IssueConnectionOrderType.Issue),
    orderByDescending: withDefault(BooleanParam, false),
    topicStrings: ArrayParam,
    dialogueIds: ArrayParam,
    minScore: withDefault(NumberParam, 0),
    maxScore: withDefault(NumberParam, 100),
    withFollowUpAction: withDefault(BooleanParam, false),
  });
  const [totalPages, setTotalPages] = useState<number>(0);

  const { loading: isIssuesLoading } = useGetWorkspaceIssuesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      workspaceId: activeCustomer?.id as string,
      filter: {
        perPage: filter.perPage,
        offset: filter.pageIndex * filter.perPage,
        orderBy: {
          by: filter.orderByField as IssueConnectionOrderType,
          desc: filter.orderByDescending,
        },
        search: filter.search,
        startDate: filter.startDate ? filter.startDate : undefined,
        endDate: filter.endDate ? filter.endDate : undefined,
        topicStrings: filter.topicStrings?.filter(isPresent) || [],
      },
    },
    errorPolicy: 'ignore',
    onCompleted: (fetchedData) => {
      setIssues(
        fetchedData?.customer?.issueConnection?.issues as IssueFragmentFragment[] || [],
      );

      setTotalPages(fetchedData?.customer?.issueConnection?.totalPages || 0);
    },
  });

  console.log('Issues: ', issues);

  const { loading: isLoading } = useGetWorkspaceSessionsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      workspaceId: activeCustomer?.id as string,
      filter: {
        offset: filter.pageIndex * filter.perPage,
        startDate: filter.startDate ? filter.startDate : undefined,
        perPage: filter.perPage,
        endDate: filter.endDate ? filter.endDate : undefined,
        orderBy: {
          by: filter.orderByField as SessionConnectionOrder,
          desc: filter.orderByDescending,
        },
        search: filter.search,
        dialogueIds: filter.dialogueIds?.filter(isPresent) || [],
        scoreRange: {
          min: filter.minScore,
          max: filter.maxScore,
        },
        withFollowUpAction: filter.withFollowUpAction,
      },
    },
    errorPolicy: 'ignore',
    onCompleted: (fetchedData) => {
      setSessions(
        fetchedData?.customer?.sessionConnection?.sessions || [],
      );

      setTotalPages(fetchedData?.customer?.sessionConnection?.totalPages || 0);
    },
  });

  const handleDateChange = (dates: Date[] | null) => {
    if (dates) {
      const [newStartDate, newEndDate] = dates;
      setFilter({
        ...filter,
        startDate: dateFormat(startOfDay(newStartDate), DateFormat.DayTimeFormat),
        endDate: dateFormat(endOfDay(newEndDate), DateFormat.DayTimeFormat),
        pageIndex: 0,
      });
    } else {
      setFilter({
        ...filter,
        startDate: null,
        endDate: null,
        pageIndex: 0,
      });
    }
  };

  const handleSingleDateFilterChange = (day: Date) => {
    setFilter({
      ...filter,
      startDate: dateFormat(startOfDay(day), DateFormat.DayTimeFormat),
      endDate: dateFormat(endOfDay(day), DateFormat.DayTimeFormat),
      pageIndex: 0,
    });
  };

  const handleMultiDateFilterChange = (newStartDate?: Date, newEndDate?: Date) => {
    setFilter({
      ...filter,
      startDate: newStartDate ? dateFormat(newStartDate, DateFormat.DayTimeFormat) : undefined,
      endDate: newEndDate ? dateFormat(newEndDate, DateFormat.DayTimeFormat) : undefined,
      pageIndex: 0,
    });
  };

  const handleSearchTermChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };
  const { menuProps, openMenu, closeMenu, activeItem: contextInteraction } = useMenu<IssueFragmentFragment>();
  const columns = '50px minmax(200px, 1fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr)';

  return (
    <View documentTitle="haas | Feedback">
      <UI.ViewBody>
        <UI.Div pb={4} position="relative" zIndex={10000}>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div>
              <UI.H4 fontSize="1.1rem" color="off.500">
                {t('issues')}
              </UI.H4>
            </UI.Div>
          </UI.Flex>
        </UI.Div>
        <UI.Flex mb={2} justifyContent="space-between" alignItems="center">
          <UI.Flex mb={2} justifyContent="flex-start">
            <PickerButton label={t('add_filter')} icon={<Plus />}>
              {() => (
                <TabbedMenu
                  menuHeader={t('add_filter')}
                  tabs={[
                    { label: t('search'), icon: <Search /> },
                    { label: t('date'), icon: <Calendar /> },
                    { label: t('score'), icon: <BarChart2 /> },
                  ]}
                >
                  <UI.Div id="searchFilter">
                    <UI.Stack>
                      <UI.RadioHeader>
                        {t('filter_by_search')}
                      </UI.RadioHeader>
                      <UI.Div mb={1}>
                        <UI.Muted>{t('filter_by_search_helper')}</UI.Muted>
                      </UI.Div>
                      <SearchBar
                        search={filter.search}
                        onSearchChange={handleSearchTermChange}
                      />
                    </UI.Stack>
                  </UI.Div>

                  <UI.Div id="dateFilter">
                    <UI.Stack spacing={2}>
                      <UI.RadioHeader>
                        {t('filter_by_date')}
                      </UI.RadioHeader>
                      <UI.Div mb={1}>
                        <UI.Muted>{t('show_interactions_between')}</UI.Muted>
                      </UI.Div>
                      <UI.Div>
                        <UI.DatePicker
                          value={[
                            filter.startDate ? parse(filter.startDate, DateFormat.DayTimeFormat) : undefined,
                            filter.endDate ? parse(filter.endDate, DateFormat.DayTimeFormat) : undefined,
                          ]}
                          onChange={handleDateChange}
                          range
                        />
                      </UI.Div>
                      <UI.Button size="sm" onClick={() => handleDateChange(null)}>{t('reset')}</UI.Button>
                    </UI.Stack>
                  </UI.Div>

                  <UI.Div id="scoreFilter">
                    <UI.Stack spacing={2}>
                      <UI.RadioHeader>
                        {t('filter_by_score')}
                      </UI.RadioHeader>
                      <UI.Div mb={1}>
                        <UI.Muted>{t('show_interactions_between')}</UI.Muted>
                      </UI.Div>
                      <UI.Div>
                        <UI.RangeSlider
                          stepSize={1}
                          defaultValue={[filter.minScore || 0, filter.maxScore || 100]}
                          min={0}
                          max={100}
                          onChange={(e: any) => setFilter({ pageIndex: 0, minScore: e[0], maxScore: e[1] })}
                        />
                      </UI.Div>
                      <UI.Button size="sm" onClick={() => setFilter({ pageIndex: 0, minScore: 0, maxScore: 100 })}>
                        {t('reset')}
                      </UI.Button>
                    </UI.Stack>
                  </UI.Div>
                </TabbedMenu>
              )}
            </PickerButton>

            <UI.Stack ml={4} isInline spacing={4} alignItems="center">
              <Table.FilterButton
                condition={!!filter.search}
                filterKey="search"
                value={filter.search}
                onClose={() => setFilter({ search: '' })}
              />
              <Table.FilterButton
                condition={!!(filter.startDate || filter.endDate)}
                filterKey="date"
                value={`${filter.startDate ? format(parse(filter.startDate, DateFormat.DayTimeFormat), DateFormat.DayFormat) : 'N/A'} - ${filter.endDate ? format(parse(filter.endDate, DateFormat.DayTimeFormat), DateFormat.DayFormat) : 'N/A'}`}
                onClose={() => setFilter({ startDate: undefined, endDate: undefined })}
              />
              <Table.FilterButton
                condition={!!filter.dialogueIds?.length}
                filterKey="team"
                value={`${!!filter.dialogueIds?.length && filter?.dialogueIds?.length > 1
                  ? 'Multiple teams'
                  : sessions.find((session) => session.dialogueId === filter.dialogueIds?.[0])?.dialogue?.title}`}
                onClose={() => setFilter({ dialogueIds: [] })}
              />
              <Table.FilterButton
                condition={filter.minScore > 0 || filter.maxScore < 100}
                filterKey="score"
                value={`${formatScore(filter.minScore)} - ${formatScore(filter.maxScore)}`}
                onClose={() => setFilter({ minScore: 0, maxScore: 100 })}
              />

              <Table.FilterButton
                condition={filter.withFollowUpAction}
                filterKey="show"
                value="urgent only"
                onClose={() => setFilter({ withFollowUpAction: false })}
              />
            </UI.Stack>

          </UI.Flex>
          <SearchBar
            search={filter.search}
            onSearchChange={handleSearchTermChange}
          />
        </UI.Flex>
        <UI.Div width="100%">
          <Table.HeadingRow gridTemplateColumns={columns}>
            <Table.HeadingCell>
              {t('score')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('issue')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('total_actionables')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('urgent')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('groups')}
            </Table.HeadingCell>
          </Table.HeadingRow>
          <UI.Div>
            <Menu.Base
              {...menuProps}
              onClose={closeMenu}
            >
              <Menu.Header>
                <UI.Icon>
                  <Filter />
                </UI.Icon>
                {t('filter')}
              </Menu.Header>
              <Menu.SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <AlignLeft />
                  </UI.Icon>
                  {t('Session')}
                </UI.Flex>
              )}
              >
                <Menu.Item
                  disabled={!contextInteraction?.followUpAction}
                  onClick={
                    () => setFilter({ pageIndex: 0, withFollowUpAction: true })
                  }
                >
                  Show only urgent feedback
                </Menu.Item>
                {contextInteraction && (
                  <Menu.Item
                    onClick={
                      () => setFilter({
                        pageIndex: 0, search: getMainTopicValue(contextInteraction as SessionFragmentFragment),
                      })
                    }
                  >
                    <UI.Span>Show feedback with answer</UI.Span>
                    <UI.Span ml="2px" fontWeight="bold" color="main">
                      {getMainTopicValue(contextInteraction as SessionFragmentFragment)}
                    </UI.Span>
                  </Menu.Item>
                )}

              </Menu.SubMenu>
              <Menu.SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <User />
                  </UI.Icon>
                  {t('Team')}
                </UI.Flex>
              )}
              >
                <Menu.Item
                  onClick={
                    () => setFilter({ pageIndex: 0, dialogueIds: [contextInteraction?.dialogueId as string] })
                  }
                >
                  Show all from this team
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu label={(
                <UI.Flex>
                  <UI.Icon mr={1} width={10}>
                    <Calendar />
                  </UI.Icon>
                  {t('date')}
                </UI.Flex>
              )}
              >
                <Menu.Item
                  onClick={() => handleMultiDateFilterChange(undefined, new Date(contextInteraction?.createdAt))}
                >
                  <>
                    {t('before_day_of')}
                    {' '}
                    {formatSimpleDate(contextInteraction?.createdAt)}
                  </>
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleSingleDateFilterChange(contextInteraction?.createdAt)}
                >
                  <>
                    {t('on_day_of')}
                    {' '}
                    {formatSimpleDate(contextInteraction?.createdAt)}
                  </>
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleMultiDateFilterChange(new Date(contextInteraction?.createdAt), undefined)}
                >
                  <>
                    {t('after_day_of')}
                    {' '}
                    {formatSimpleDate(contextInteraction?.createdAt)}
                  </>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu.Base>

            {issues.map((issue) => (
              <Table.Row
                isLoading={isLoading}
                onClick={() => {
                  setModalIsOpen({ isOpen: true, issueId: issue.id as string });
                }}
                gridTemplateColumns={columns}
                key={issue.id}
                onContextMenu={(e) => openMenu(e, issue)}
              >
                <Table.Cell>
                  <ScoreBox score={issue.basicStats?.average} />
                </Table.Cell>
                <Table.Cell maxWidth={300}>
                  <UI.ColumnFlex justifyContent="flex-start">
                    <UI.Flex alignItems="center">
                      <UI.Span fontWeight={600} color="off.500">
                        {issue.topic.name}
                      </UI.Span>
                    </UI.Flex>
                  </UI.ColumnFlex>
                </Table.Cell>
                <Table.Cell>
                  <UI.Span fontWeight={600} color="off.500">
                    {issue.basicStats?.responseCount}
                    {' '}
                    actionables
                  </UI.Span>
                </Table.Cell>
                <Table.Cell>
                  <UrgentContainer hasUrgent={!!issue.basicStats?.urgentCount}>
                    <UI.Icon>
                      <AlertTriangle width="1.5em" />
                    </UI.Icon>

                    <UI.Span ml="0.5em" fontWeight={600}>
                      {issue.basicStats?.urgentCount}
                      {' '}
                      URGENT
                    </UI.Span>
                  </UrgentContainer>

                </Table.Cell>
                <Table.Cell>
                  <UI.Span ml="0.5em" color="off.500" fontWeight={600}>
                    in
                    {' '}
                    {issue.teamCount}
                    {' '}
                    group(s)
                  </UI.Span>
                </Table.Cell>
              </Table.Row>
            ))}
          </UI.Div>
          <UI.Flex justifyContent="flex-end" mt={4}>
            {totalPages > 1 && (
              <Table.Pagination
                pageIndex={filter.pageIndex}
                maxPages={totalPages}
                perPage={filter.perPage}
                isLoading={isLoading}
                setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
              />
            )}
          </UI.Flex>
        </UI.Div>
        <Modal.Root onClose={() => setModalIsOpen({ isOpen: false, issueId: '' })} open={modalIsOpen.isOpen}>
          <IssueModalCard
            issueId={modalIsOpen.issueId}
          />
        </Modal.Root>
      </UI.ViewBody>
    </View>
  );
};
