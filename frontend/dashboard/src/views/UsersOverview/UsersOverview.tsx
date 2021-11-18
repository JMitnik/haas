import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Calendar, Filter, Search, User } from 'react-feather';
import { Route, Switch, useLocation } from 'react-router';
import { endOfDay, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { Avatar } from 'components/Common/Avatar';
import { FormatTimestamp } from 'components/Common/DateAndTime';
import {
  GetPaginatedUsersQuery,
  PaginationSortByEnum,
  UserConnectionOrder,
  useGetPaginatedUsersQuery,
} from 'types/generated-types';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { TabbedMenu } from 'components/Common/TabMenu';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { formatSimpleDate } from 'utils/dateUtils';
import SearchBar from 'components/SearchBar/SearchBar';
import Searchbar from 'components/SearchBar';

import { UserModalCard } from './UserModalCard';
import InviteUserButton from './InviteUserButton';
import InviteUserForm from './InviteUserForm';

const columns = 'minmax(50px, 1fr) minmax(50px, 1fr) minmax(200px, 1fr) minmax(30px, 1fr) minmax(50px, 1fr)';

const UserAvatarCell = ({ firstName }: { firstName?: string | null }) => {
  const nameExists = !!firstName;

  return (
    <UI.Flex alignItems="center">
      <UI.Div mr={2}>
        {nameExists ? <Avatar name={firstName || ''} brand="blue" /> : <Avatar name="A" brand="gray" />}
      </UI.Div>
      <UI.ColumnFlex>
        {nameExists && (
          <UI.Span fontWeight={600} color="gray.500">
            {firstName}
          </UI.Span>
        )}
      </UI.ColumnFlex>
    </UI.Flex>
  );
};

const UsersOverview = () => {
  const { customerSlug, goToUserView, goToUsersOverview } = useNavigator();
  const { t } = useTranslation();
  const location = useLocation();
  const [activePaginatedUsersResult, setActivePaginatedUsersResult] = useState<GetPaginatedUsersQuery>();

  const [filter, setFilter] = useQueryParams({
    startDate: DateTimeParam,
    endDate: DateTimeParam,
    search: StringParam,
    firstName: StringParam,
    lastName: StringParam,
    email: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    role: StringParam,
    orderByField: withDefault(StringParam, PaginationSortByEnum.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
  });

  const { refetch, loading: isLoading } = useGetPaginatedUsersQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug,
      filter: {
        firstName: filter.firstName,
        lastName: filter.lastName,
        email: filter.email,
        role: filter.role,
        startDate: filter.startDate ? filter.startDate.toISOString() : undefined,
        endDate: filter.endDate ? filter.endDate.toISOString() : undefined,
        search: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
        orderBy: { by: filter.orderByField as UserConnectionOrder, desc: filter.orderByDescending },
      },
    },
    errorPolicy: 'ignore',
    onCompleted: (fetchedData) => {
      setActivePaginatedUsersResult(fetchedData);
    },
  });

  const handleSearchTermChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };

  const handleSearchChange = (search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  };

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

  const handleMultiDateFilterChange = (newStartDate?: Date, newEndDate?: Date) => {
    setFilter({
      ...filter,
      startDate: newStartDate,
      endDate: newEndDate,
      pageIndex: 0,
    });
  };

  const handleRole = (role?: string | null) => {
    setFilter({ role, pageIndex: 0 });
  };

  const handleRecipientFirstName = (firstName?: string | null) => {
    setFilter({ firstName, pageIndex: 0 });
  };

  const handleRecipientLastName = (lastName?: string | null) => {
    setFilter({ lastName, pageIndex: 0 });
  };

  const handleRecipientEmail = (email?: string | null) => {
    setFilter({ email, pageIndex: 0 });
  };

  const tableData = activePaginatedUsersResult?.customer?.usersConnection?.userCustomers?.map((userCustomer) => ({
    createdAt: userCustomer.createdAt,
    ...userCustomer.user,
    role: userCustomer.role,
  })) || [];

  const pageCount = activePaginatedUsersResult?.customer?.usersConnection?.totalPages || 0;

  const handleRefetch = () => {
    refetch({
      customerSlug,
      filter: {
        firstName: filter.firstName,
        lastName: filter.lastName,
        email: filter.email,
        role: filter.role,
        startDate: filter.startDate ? filter.startDate.toISOString() : undefined,
        endDate: filter.endDate ? filter.endDate.toISOString() : undefined,
        search: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
        orderBy: { by: filter.orderByField as UserConnectionOrder, desc: filter.orderByDescending },
      },
    });
  };

  return (
    <>
      <UI.ViewHead>
        <UI.Flex width="100%" justifyContent="space-between">
          <UI.Flex alignItems="center">
            <UI.ViewTitle leftIcon={<UsersIcon fill="currentColor" />}>{t('views:users_overview')}</UI.ViewTitle>
            <InviteUserButton>
              {(onClose) => (
                <InviteUserForm onRefetch={handleRefetch} onClose={onClose} />
              )}
            </InviteUserButton>
          </UI.Flex>

          <SearchBar
            activeSearchTerm={filter.search}
            onSearchTermChange={handleSearchTermChange}
          />
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Div>
          <UI.Flex mb={2} justifyContent="space-between">

            <PickerButton arrowBg="gray.50" label={t('filter_users')} icon={(<Filter />)}>
              {() => (
                <TabbedMenu
                  menuHeader={t('filter_users')}
                  tabs={[
                    { label: t('search'), icon: <Search /> },
                    { label: t('date'), icon: <Calendar /> },
                    { label: t('recipient'), icon: <User /> },
                  ]}
                >
                  <UI.Div>
                    <UI.RadioHeader>
                      {t('filter_by_search')}
                    </UI.RadioHeader>
                    <Searchbar
                      activeSearchTerm={filter.search}
                      onSearchTermChange={handleSearchChange}
                    />
                  </UI.Div>

                  <UI.Div>
                    <UI.RadioHeader>
                      {t('filter_by_date')}
                    </UI.RadioHeader>
                    <UI.SectionSubHeader mb={2}>
                      {t('filter_by_updated_date_description')}
                    </UI.SectionSubHeader>
                    <UI.DatePicker
                      value={[filter.startDate, filter.endDate]}
                      onChange={handleDateChange}
                      range
                    />
                  </UI.Div>

                  <UI.Div>
                    <UI.Stack spacing={4}>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_first_name')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.firstName}
                          onSearchTermChange={handleRecipientFirstName}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_last_name')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.lastName}
                          onSearchTermChange={handleRecipientLastName}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_email')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.email}
                          onSearchTermChange={handleRecipientEmail}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_role_name')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.role}
                          onSearchTermChange={handleRole}
                        />
                      </UI.Div>
                    </UI.Stack>
                  </UI.Div>
                </TabbedMenu>
              )}
            </PickerButton>

            <UI.Separator bg="gray.200" />

            <UI.Stack spacing={2} isInline>
              <Table.FilterButton
                condition={!!filter.search}
                filterKey="search"
                value={filter.search}
                onClose={() => handleSearchChange('')}
              />
              <Table.FilterButton
                condition={!!filter.firstName}
                filterKey="recipientFirstName"
                value={filter.firstName}
                onClose={() => handleRecipientFirstName('')}
              />
              <Table.FilterButton
                condition={!!filter.lastName}
                filterKey="recipientLastName"
                value={filter.lastName}
                onClose={() => handleRecipientLastName('')}
              />
              <Table.FilterButton
                condition={!!(filter.startDate || filter.endDate)}
                filterKey="updatedAt"
                value={`${formatSimpleDate(filter.startDate?.toISOString())} - ${formatSimpleDate(filter.endDate?.toISOString())}`}
                onClose={() => handleMultiDateFilterChange(undefined, undefined)}
              />
              <Table.FilterButton
                condition={!!filter.email}
                filterKey="recipientEmail"
                value={filter.email}
                onClose={() => handleRecipientEmail('')}
              />
            </UI.Stack>

          </UI.Flex>

          <Table.HeadingRow gridTemplateColumns={columns}>
            <Table.HeadingCell>
              {t('first_name')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('last_name')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('email')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('role')}
            </Table.HeadingCell>
            <Table.HeadingCell
              sorting
              descending={filter.orderByDescending || false}
              onDescendChange={(isDescend) => setFilter({ orderByDescending: isDescend })}
            >
              {t('created_at')}
            </Table.HeadingCell>
          </Table.HeadingRow>
          {tableData.map((user) => (
            <Table.Row
              onClick={() => goToUserView(user.id)}
              isLoading={isLoading}
              key={user.id}
              gridTemplateColumns={columns}
            >
              <Table.Cell>
                <UserAvatarCell firstName={user.firstName} />
              </Table.Cell>

              <Table.Cell>
                {user?.lastName && (
                  <UI.Span fontWeight={600} color="gray.500">
                    {user?.lastName}
                  </UI.Span>
                )}
              </Table.Cell>

              <Table.Cell>
                <UI.Helper>
                  {user?.email}
                </UI.Helper>
              </Table.Cell>

              <Table.Cell>
                <Table.InnerCell>
                  <UI.Helper>
                    {user?.role?.name}
                  </UI.Helper>
                </Table.InnerCell>
              </Table.Cell>
              <Table.Cell>
                <FormatTimestamp timestamp={user.createdAt} />
              </Table.Cell>
            </Table.Row>
          ))}
        </UI.Div>
        <UI.Flex justifyContent="flex-end">
          <Table.Pagination
            pageIndex={filter.pageIndex}
            maxPages={pageCount}
            perPage={filter.perPage}
            isLoading={isLoading}
            setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
          />
        </UI.Flex>

        <AnimatePresence>
          <Switch
            location={location}
            key={location.pathname}
          >
            <Route
              path={ROUTES.USER_VIEW}
            >
              {({ match }) => (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UI.Modal isOpen onClose={() => goToUsersOverview()}>
                    <UserModalCard
                      onClose={() => goToUsersOverview()}
                      // @ts-ignore
                      id={match?.params?.userId}
                    />
                  </UI.Modal>
                </motion.div>
              )}
            </Route>
          </Switch>
        </AnimatePresence>
      </UI.ViewBody>
    </>
  );
};

export default UsersOverview;
