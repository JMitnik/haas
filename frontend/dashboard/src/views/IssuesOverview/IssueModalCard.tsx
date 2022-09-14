import * as UI from '@haas/ui';
import { ArrayParam, BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { BarChart2, Calendar, Plus, Search } from 'react-feather';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { ActionableConnectionOrderType, ActionableFragmentFragment, useAssignUserToActionableMutation, useGetIssueQuery, useSetActionableStatusMutation } from 'types/generated-types';
import { DateFormat, useDate } from 'hooks/useDate';
import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { TabbedMenu } from 'components/Common/TabMenu';
import { TargetEntry } from 'views/AddAutomationView/CreateActionModalCard';
import { UserNodePicker } from 'components/NodePicker/UserNodePicker';
import { useFormatter } from 'hooks/useFormatter';
import Dropdown from 'components/Dropdown';
import SearchBar from 'components/Common/SearchBar';

import { ActionableStatusPicker } from './ActionableStatusPicker';
import { ChangeableEmailContainer, StatusBox } from './IssueOverview.styles';

interface InteractionModalCardProps {
  issueId: string;
  userEntries: TargetEntry[];
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

export const IssueModalCard = ({ issueId, userEntries }: InteractionModalCardProps) => {
  const { t } = useTranslation();
  const { formatScore } = useFormatter();
  const { parse, format: dateFormat, getStartOfWeek, getNWeekAgo, getEndOfWeek } = useDate();
  const [actionables, setActionables] = useState<ActionableFragmentFragment[]>(() => []);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [filter, setFilter] = useQueryParams({
    startDate: withDefault(StringParam, dateFormat(getStartOfWeek(getNWeekAgo(0)), DateFormat.DayTimeFormat)),
    endDate: withDefault(StringParam, dateFormat(getEndOfWeek(new Date()), DateFormat.DayTimeFormat)),
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 2),
    orderByField: withDefault(StringParam, ActionableConnectionOrderType.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
    topicStrings: ArrayParam,
    dialogueIds: ArrayParam,
    minScore: withDefault(NumberParam, 0),
    maxScore: withDefault(NumberParam, 100),
    withFollowUpAction: withDefault(BooleanParam, false),
  });

  const { data, loading } = useGetIssueQuery({
    variables: {
      input: {
        issueId,
      },
      actionableFilter: {
        perPage: filter.perPage,
        offset: filter.pageIndex * filter.perPage,
        orderBy: {
          by: filter.orderByField as ActionableConnectionOrderType,
          desc: filter.orderByDescending,
        },
        search: filter.search,
        startDate: filter.startDate,
        endDate: filter.endDate,
      },
    },
    errorPolicy: 'ignore',
    onCompleted: (fetchedData) => {
      setActionables(
        fetchedData?.issue?.actionableConnection?.actionables as ActionableFragmentFragment[] || [],
      );

      setTotalPages(fetchedData?.issue?.actionableConnection?.totalPages || 0);
    },
  });

  const [assignUserToActionable] = useAssignUserToActionableMutation({
    refetchQueries: ['GetIssue'],
  });

  const [setActionableStatus] = useSetActionableStatusMutation({
    refetchQueries: ['GetIssue'],
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

  const columns = 'minmax(100px, 0.5fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(150px, 0.5fr)';
  const issue = data?.issue;
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
                      <ActionableStatusPicker
                        actionableId={actionable.id as string}
                        onChange={setActionableStatus}
                        status={actionable.status}
                      />
                      {/* <StatusBox isSelected status={actionable.status} /> */}
                    </UI.Flex>
                  </UI.ColumnFlex>
                </Table.Cell>
                <Table.Cell>
                  <Table.InnerCell>
                    <Dropdown
                      isRelative
                      renderOverlay={({ onClose }) => (
                        <UserNodePicker
                          items={userEntries}
                          onClose={onClose}
                          onChange={(user: any) => {
                            assignUserToActionable({
                              variables: {
                                input: {
                                  assigneeId: user?.value,
                                  actionableId: actionable.id as string,
                                },
                              },
                            });
                            onClose();
                          }}
                        />
                      )}
                    >
                      {({ onOpen }) => (
                        <UI.Div
                          width="100%"
                          justifyContent="center"
                          display="flex"
                          alignItems="center"
                        >
                          {actionable.assignee?.email ? (
                            <ChangeableEmailContainer onClick={onOpen}>
                              <UI.Helper>
                                {actionable.assignee?.email}
                              </UI.Helper>
                              <UI.IconButton
                                aria-label="close"
                                icon={() => <IconClose />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  assignUserToActionable({
                                    variables: {
                                      input: {
                                        assigneeId: null,
                                        actionableId: actionable.id as string,
                                      },
                                    },
                                  });
                                }}
                                width={10}
                                minWidth={10}
                              />
                            </ChangeableEmailContainer>
                          ) : (
                            <UI.Div onClick={onOpen}>
                              <UI.Helper>
                                None
                              </UI.Helper>
                            </UI.Div>
                          )}
                        </UI.Div>
                      )}
                    </Dropdown>

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
      </UI.ModalBody>
    </>
  );
};
