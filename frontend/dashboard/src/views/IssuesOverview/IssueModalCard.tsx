import * as UI from '@haas/ui';
import { ArrayParam, BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as Menu from 'components/Common/Menu';
import * as Modal from 'components/Common/Modal';
import * as Table from 'components/Common/Table';
import { DateFormat, useDate } from 'hooks/useDate';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { SessionConnectionOrder, useGetIssueQuery } from 'types/generated-types';
import { TabbedMenu } from 'components/Common/TabMenu';
import SearchBar from 'components/Common/SearchBar';

import { BarChart2, Calendar, Plus, Search } from 'react-feather';
import { endOfDay, format, startOfDay } from 'date-fns';
import { isPresent } from 'ts-is-present';
import { useFormatter } from 'hooks/useFormatter';
import { StatusBox } from './IssueOverview.styles';

interface InteractionModalCardProps {
  issueId: string;
}

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

export const IssueModalCard = ({ issueId }: InteractionModalCardProps) => {
  const { t } = useTranslation();
  const { formatScore } = useFormatter();
  const { parse, format: dateFormat, getStartOfWeek, getNWeekAgo, getEndOfWeek } = useDate();

  const [filter, setFilter] = useQueryParams({
    startDate: withDefault(StringParam, dateFormat(getStartOfWeek(getNWeekAgo(0)), DateFormat.DayTimeFormat)),
    endDate: withDefault(StringParam, dateFormat(getEndOfWeek(new Date()), DateFormat.DayTimeFormat)),
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    orderByField: withDefault(StringParam, SessionConnectionOrder.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
    topicStrings: ArrayParam,
    dialogueIds: ArrayParam,
    minScore: withDefault(NumberParam, 0),
    maxScore: withDefault(NumberParam, 100),
    withFollowUpAction: withDefault(BooleanParam, false),
  });

  const { data, loading, error } = useGetIssueQuery({
    variables: {
      input: {
        issueId,
      },
      actionableFilter: {
        startDate: filter.startDate,
        endDate: filter.endDate,
      },
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

  const issue = data?.issue;
  const actionables = issue?.actionables.filter(isPresent);
  console.log('Issue: ', issue);
  const columns = 'minmax(100px, 0.5fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(150px, 0.5fr)';
  const totalPages = 1;
  // Urgent Status, Assignee, Team, CreatedAt
  return (
    <>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('issue')}
          {' '}
          -
          {' '}
          {issue?.topic.name}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {loading && !data && <UI.Loader />}
        {!loading && data && (
          <>
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
                      : actionables?.find((actionable) => actionable?.dialogueId === filter.dialogueIds?.[0])?.dialogue?.title}`}
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
                  {t('status')}
                </Table.HeadingCell>

                <Table.HeadingCell>
                  {t('assignee')}
                </Table.HeadingCell>
                <Table.HeadingCell>
                  {t('team')}
                </Table.HeadingCell>
                <Table.HeadingCell>
                  {t('when')}
                </Table.HeadingCell>
              </Table.HeadingRow>

              {actionables?.map((actionable) => (
                <Table.Row
                  isLoading={loading}
                  gridTemplateColumns={columns}
                  key={actionable.id}
                >
                  <Table.Cell maxWidth={300}>
                    <UI.ColumnFlex justifyContent="flex-start">
                      <UI.Flex alignItems="center">
                        <StatusBox status={actionable.status} />
                      </UI.Flex>
                    </UI.ColumnFlex>
                  </Table.Cell>
                  <Table.Cell>
                    <Table.InnerCell>
                      <UI.Div onClick={(e) => {
                        e.stopPropagation();
                        // openRoleModal({ roleId: user.role?.id || '', userId: user.id || '' });
                      }}
                      >
                        <UI.Helper>
                          {actionable.assignee?.email || 'None'}
                        </UI.Helper>
                      </UI.Div>
                    </Table.InnerCell>

                  </Table.Cell>
                  <Table.Cell>
                    <UI.Span fontWeight={600} color="off.500">
                      {actionable.dialogue?.title}
                    </UI.Span>

                  </Table.Cell>
                  <Table.Cell>
                    <DateCell timestamp={actionable.createdAt as string} />
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
                  isLoading={loading}
                  setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
                />
              )}
            </UI.Flex>
          </>
        )}
      </UI.ModalBody>
    </>
  );
};
