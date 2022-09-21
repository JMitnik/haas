/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import '@szhsin/react-menu/dist/index.css';
import * as UI from '@haas/ui';
import {
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { Calendar, Plus, Search } from 'react-feather';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as ContextMenu from 'components/Common/ContextMenu';
import * as Table from 'components/Common/Table';
import {
  ActionableConnectionOrderType,
  ActionableFragmentFragment,
  ActionableState,
  useAssignUserToActionableMutation,
  useGetUsersAndRolesQuery,
  useGetWorkspaceActionablesQuery,
  useSetActionableStatusMutation,
} from 'types/generated-types';
import { DateFormat, useDate } from 'hooks/useDate';
import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { TabbedMenu } from 'components/Common/TabMenu';
import { UserNodePicker } from 'components/NodePicker/UserNodePicker';
import { View } from 'layouts/View';
import { mapToUserPickerEntries } from 'views/AddAutomationView/AutomationForm.helpers';
import { useCustomer } from 'providers/CustomerProvider';
import Dropdown from 'components/Dropdown';
import SearchBar from 'components/Common/SearchBar/SearchBar';

import { ActionableStatusPicker } from './ActionableStatusPicker';
import { ChangeableEmailContainer, DateCell } from './IssueOverview.styles';

export const IssuesOverview = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const { parse, format: dateFormat } = useDate();
  const [actionables, setActionables] = useState<ActionableFragmentFragment[]>(() => []);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [filter, setFilter] = useQueryParams({
    startDate: StringParam,
    endDate: StringParam,
    search: StringParam,
    status: StringParam,
    isVerified: BooleanParam,
    assigneeId: StringParam,
    requestEmail: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    orderByField: withDefault(StringParam, ActionableConnectionOrderType.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
    topic: StringParam,
    dialogueId: StringParam,
    withFollowUpAction: withDefault(BooleanParam, false),
  });

  const { loading } = useGetWorkspaceActionablesQuery({
    variables: {
      workspaceId: activeCustomer?.id as string,
      filter: {
        perPage: filter.perPage,
        offset: filter.pageIndex * filter.perPage,
        isVerified: filter.isVerified || undefined,
        requestEmail: filter.requestEmail || undefined,
        assigneeId: filter.assigneeId || undefined,
        dialogueId: filter.dialogueId || undefined,
        topic: filter.topic || undefined,
        status: filter.status as ActionableState || undefined,
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
        fetchedData?.customer?.actionableConnection?.actionables as ActionableFragmentFragment[] || [],
      );

      setTotalPages(fetchedData?.customer?.actionableConnection?.totalPages || 0);
    },
  });

  const [assignUserToActionable] = useAssignUserToActionableMutation({
    refetchQueries: ['GetWorkspaceActionables'],
  });

  const [setActionableStatus] = useSetActionableStatusMutation({
    refetchQueries: ['GetWorkspaceActionables'],
  });

  const { data: userRoleData } = useGetUsersAndRolesQuery({
    variables: {
      customerSlug: activeCustomer?.slug as string,
    },
  });

  const userPickerEntries = mapToUserPickerEntries(userRoleData?.customer as any);

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
        startDate: undefined,
        endDate: undefined,
        pageIndex: 0,
      });
    }
  };

  const handleGroupChange = (dialogueId: string) => {
    setFilter({ dialogueId, pageIndex: 0 });
  };

  const handleTopicChange = (topic: string) => {
    setFilter({ topic, pageIndex: 0 });
  };

  const handleAssigneeChange = (assigneeId: string) => {
    setFilter({ assigneeId, pageIndex: 0 });
  };

  const handleRequestEmailChange = (requestEmail: string) => {
    setFilter(() => ({
      requestEmail,
      pageIndex: 0,
    }));
  };

  const handleSearchTermChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };

  const handleStatusChange = (status: ActionableState) => {
    setFilter(() => ({
      status,
      pageIndex: 0,
    }));
  };

  const handleIsVerifiedChange = () => {
    setFilter(() => ({
      isVerified: true,
    }));
  };

  const columns = `minmax(100px, 0.35fr) minmax(150px, 1fr) minmax(100px, 0.5fr) 
  minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 0.5fr)`;

  return (
    <View documentTitle="haas | Issues">
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
                  ]}
                >
                  <UI.Div id="searchFilter">
                    <UI.Stack>
                      <UI.RadioHeader>
                        {t('filter_by_search')}
                      </UI.RadioHeader>
                      <UI.Div mb={1}>
                        <UI.Muted>{t('filter_by_search_issue_helper')}</UI.Muted>
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
                </TabbedMenu>
              )}
            </PickerButton>

            <UI.Stack ml={4} isInline spacing={4} alignItems="center">
              <Table.FilterButton
                condition={!!filter.assigneeId}
                filterKey="assignee"
                value={actionables.find((actionable) => actionable.assignee?.id === filter.assigneeId)?.assignee?.email}
                onClose={() => setFilter({ assigneeId: undefined })}
              />
              <Table.FilterButton
                condition={!!filter.isVerified}
                filterKey="show"
                value="only verified"
                onClose={() => setFilter({ isVerified: undefined })}
              />
              <Table.FilterButton
                condition={!!filter.status}
                filterKey="status"
                value={filter.status}
                onClose={() => setFilter({ status: '' })}
              />
              <Table.FilterButton
                condition={!!filter.topic}
                filterKey="topic"
                value={filter.topic}
                onClose={() => setFilter({ topic: undefined })}
              />
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
                condition={!!filter.dialogueId}
                filterKey="group"
                value={actionables?.find((actionable) => actionable?.dialogueId === filter.dialogueId)?.dialogue?.title}
                onClose={() => setFilter({ dialogueId: undefined })}
              />
              <Table.FilterButton
                condition={!!filter.requestEmail}
                filterKey="requested by"
                value={filter.requestEmail}
                onClose={() => setFilter({ requestEmail: undefined })}
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
          <UI.Div width="100%">
            <Table.HeadingRow gridTemplateColumns={columns}>
              <Table.HeadingCell>
                {t('status')}
              </Table.HeadingCell>
              <Table.HeadingCell>
                {t('requested_by')}
              </Table.HeadingCell>
              <Table.HeadingCell>
                {t('topic')}
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
              <UI.Div>
                <ContextMenu.Root>
                  <ContextMenu.Trigger>
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
                              isVerified={actionable.isVerified}
                            />
                          </UI.Flex>
                        </UI.ColumnFlex>
                      </Table.Cell>
                      <Table.Cell>
                        <Table.InnerCell>
                          <UI.Helper>
                            {actionable.requestEmail || 'No Information'}
                          </UI.Helper>
                        </Table.InnerCell>
                      </Table.Cell>
                      <Table.Cell>
                        <UI.Span fontWeight={600} color="off.500">
                          {actionable.issue?.topic.name}
                        </UI.Span>
                      </Table.Cell>
                      <Table.Cell>
                        <Table.InnerCell>
                          <Dropdown
                            isRelative
                            renderOverlay={({ onClose }) => (
                              <UserNodePicker
                                items={userPickerEntries}
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
                  </ContextMenu.Trigger>
                  <ContextMenu.Content>
                    <ContextMenu.Item onClick={() => handleStatusChange(actionable.status)}>
                      Show all with status
                      {' '}
                      <UI.Span fontWeight="bold" ml="2px" mr="2px">{actionable.status}</UI.Span>
                    </ContextMenu.Item>
                    <ContextMenu.Item onClick={() => handleIsVerifiedChange()} disabled={!actionable.isVerified}>
                      Show all
                      {' '}
                      <UI.Span fontWeight="bold" ml="2px" mr="2px">verified</UI.Span>
                      {' '}
                      action requests
                    </ContextMenu.Item>
                    {actionable.assignee?.email && (
                      <ContextMenu.Item onClick={() => handleAssigneeChange(actionable.assignee?.id as string)}>
                        Show all assigned to
                        {' '}
                        <UI.Span fontWeight="bold" ml="2px" mr="2px">{actionable.assignee?.email}</UI.Span>
                      </ContextMenu.Item>
                    )}
                    {actionable.requestEmail && (
                      <ContextMenu.Item onClick={() => handleRequestEmailChange(actionable.requestEmail as string)}>
                        Show all requested by
                        <UI.Span fontWeight="bold" ml="2px" mr="2px">{actionable.requestEmail}</UI.Span>
                      </ContextMenu.Item>
                    )}
                    <ContextMenu.Item onClick={() => handleTopicChange(actionable.issue?.topic.name as string)}>
                      Show all with topic
                      {' '}
                      <UI.Span fontWeight="bold" ml="2px" mr="2px">{actionable.issue?.topic.name}</UI.Span>
                    </ContextMenu.Item>
                    <ContextMenu.Item onClick={() => handleGroupChange(actionable.dialogue?.id as string)}>
                      Show all from
                      {' '}
                      <UI.Span fontWeight="bold" ml="2px" mr="2px">{actionable.dialogue?.title}</UI.Span>
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Root>

              </UI.Div>

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
        </UI.Div>
      </UI.ViewBody>
    </View>
  );
};
