/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import '@szhsin/react-menu/dist/index.css';
import * as UI from '@haas/ui';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Calendar, Filter, Link2, Plus, Search } from 'react-feather';
import { Flex } from '@haas/ui';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Menu from 'components/Common/Menu';
import * as Modal from 'components/Common/Modal';
import * as Table from 'components/Common/Table';
import { Avatar } from 'components/Common/Avatar';
import { Circle } from 'components/Common/Circle';
import {
  CompactEntriesPath,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import {
  SessionConnectionOrder,
  SessionFragmentFragment, useGetWorkspaceSessionsQuery,
} from 'types/generated-types';
import { TabbedMenu } from 'components/Common/TabMenu';
import { View } from 'layouts/View';
import { formatSimpleDate } from 'utils/dateUtils';
import { useCustomer } from 'providers/CustomerProvider';
import { useMenu } from 'components/Common/Menu/useMenu';
import { useRouteModal } from 'components/Common/Modal';
import SearchBar from 'components/Common/SearchBar/SearchBar';

import { ContactableUserCell } from './InteractionTableCells';
import { InteractionModalCard } from '../InteractionsOverview/InteractionModalCard';

const AnonymousCell = ({ sessionId }: { sessionId: string }) => {
  const { t } = useTranslation();
  return (
    <UI.Flex alignItems="center">
      <UI.Div mr={2}>
        <Avatar name="A" brand="gray" />
      </UI.Div>
      <UI.ColumnFlex>
        <UI.Span fontWeight={600} color="gray.500">
          {t('anonymous')}
        </UI.Span>
        <UI.Span color="gray.400" fontSize="0.7rem">
          {sessionId}
        </UI.Span>
      </UI.ColumnFlex>
    </UI.Flex>
  );
};

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
        {' '}
        {session.dialogue?.title}
      </UI.Helper>
    </Table.InnerCell>
  </UI.Div>
);

export const FeedbackOverview = () => {
  const { t } = useTranslation();
  const { customerSlug } = useNavigator();
  const { activeCustomer } = useCustomer();

  const [sessions, setSessions] = useState<SessionFragmentFragment[]>(() => []);

  const [filter, setFilter] = useQueryParams({
    startDate: DateTimeParam,
    endDate: DateTimeParam,
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    orderByField: withDefault(StringParam, SessionConnectionOrder.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
  });
  const [totalPages, setTotalPages] = useState<number>(0);

  const { loading: isLoading } = useGetWorkspaceSessionsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: activeCustomer?.id as string,
      filter: {
        offset: filter.pageIndex * filter.perPage,
        startDate: filter.startDate ? filter.startDate?.toISOString() : undefined,
        perPage: filter.perPage,
        endDate: filter.endDate ? filter.endDate?.toISOString() : undefined,
        orderBy: {
          by: filter.orderByField as SessionConnectionOrder,
          desc: filter.orderByDescending,
        },
        search: filter.search,
      },
    },
    errorPolicy: 'ignore',
    onCompleted: (fetchedData) => {
      setSessions(
        fetchedData?.customer?.sessionConnection?.sessions || [],
      );

      setTotalPages(fetchedData.customer?.sessionConnection?.totalPages || 0);
    },
  });

  const handleDateChange = (dates: Date[] | null) => {
    if (dates) {
      const [newStartDate, newEndDate] = dates;
      setFilter({
        ...filter,
        startDate: startOfDay(newStartDate),
        endDate: endOfDay(newEndDate),
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
      startDate: startOfDay(day),
      endDate: endOfDay(day),
      pageIndex: 0,
    });
  };

  const handleMultiDateFilterChange = (newStartDate?: Date, newEndDate?: Date) => {
    setFilter({
      ...filter,
      startDate: newStartDate,
      endDate: newEndDate,
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
  const { menuProps, openMenu, closeMenu, activeItem: contextInteraction } = useMenu<SessionFragmentFragment>();
  const columns = 'minmax(200px, 1fr) minmax(150px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr)';

  const [openModal, closeModal, isOpenModal, params] = useRouteModal<{ interactionId: string }>({
    matchUrlKey: ROUTES.WORKSPACE_INTERACTION_VIEW,
    exitUrl: `/dashboard/b/${customerSlug}/dashboard/feedback`,
  });

  return (
    <View documentTitle="haas | Interactions">
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle>
              {t('views:interactions_view')}
            </UI.ViewTitle>
          </UI.Flex>

          <Flex alignItems="center">
            <SearchBar
              search={filter.search}
              onSearchChange={handleSearchTermChange}
            />
          </Flex>
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Flex mb={2} justifyContent="flex-start">
          <UI.Stack isInline spacing={2} alignItems="center">
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
                          value={[filter.startDate, filter.endDate]}
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

            <UI.Separator bg="gray.200" />

            {/* @ts-ignore */}
            <UI.Stack isInline spacing={4} alignItems="center">
              <Table.FilterButton
                condition={!!filter.search}
                filterKey="search"
                value={filter.search}
                onClose={() => setFilter({ search: '' })}
              />
              <Table.FilterButton
                condition={!!(filter.startDate || filter.endDate)}
                filterKey="date"
                value={`${formatSimpleDate(filter.startDate?.toISOString())} - ${formatSimpleDate(filter.endDate?.toISOString())}`}
                onClose={() => setFilter({ startDate: undefined, endDate: undefined })}
              />
            </UI.Stack>
          </UI.Stack>
        </UI.Flex>
        <UI.Flex mb={4} justifyContent="flex-end">
          {/* @ts-ignore */}
        </UI.Flex>
        <UI.Div width="100%">
          <Table.HeadingRow gridTemplateColumns={columns}>
            <Table.HeadingCell>
              {t('user')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('interaction')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('team')}
            </Table.HeadingCell>
            <Table.HeadingCell
              sorting
              descending={filter.orderByDescending || false}
              onDescendChange={(isDescend) => setFilter({ orderByDescending: isDescend })}
            >
              {t('when')}
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
                    <Calendar />
                  </UI.Icon>
                  {t('date')}
                </UI.Flex>
              )}
              >
                <Menu.Item
                  onClick={() => handleMultiDateFilterChange(undefined, new Date(contextInteraction?.createdAt))}
                >
                  {t('before_day_of')}
                  {' '}
                  {formatSimpleDate(contextInteraction?.createdAt)}
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleSingleDateFilterChange(contextInteraction?.createdAt)}
                >
                  {t('on_day_of')}
                  {' '}
                  {formatSimpleDate(contextInteraction?.createdAt)}
                </Menu.Item>
                <Menu.Item
                  onClick={() => handleMultiDateFilterChange(new Date(contextInteraction?.createdAt), undefined)}
                >
                  {t('after_day_of')}
                  {' '}
                  {formatSimpleDate(contextInteraction?.createdAt)}
                </Menu.Item>
              </Menu.SubMenu>
            </Menu.Base>

            {sessions.map((session) => (
              <Table.Row
                isLoading={isLoading}
                onClick={() => openModal({ interactionId: session.id })}
                gridTemplateColumns={columns}
                key={session.id}
                onContextMenu={(e) => openMenu(e, session)}
              >
                <Table.Cell>
                  {session?.followUpAction ? (
                    <ContactableUserCell followUpAction={session.followUpAction} sessionId={session.id} />
                  ) : (
                    <AnonymousCell sessionId={session.id} />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {/* @ts-ignore */}
                  <CompactEntriesPath nodeEntries={session.nodeEntries} />
                </Table.Cell>
                <Table.Cell>
                  <DistributionInnerCell session={session} />
                </Table.Cell>
                <Table.Cell>
                  <DateCell timestamp={session.createdAt} />
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
        <Modal.Root onClose={closeModal} open={isOpenModal}>
          <InteractionModalCard
            sessionId={params?.interactionId}
          />
        </Modal.Root>
      </UI.ViewBody>
    </View>
  );
};
