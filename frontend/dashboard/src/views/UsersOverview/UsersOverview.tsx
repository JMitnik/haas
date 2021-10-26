import * as UI from '@haas/ui';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Calendar, Plus, Search, User } from 'react-feather';
import { endOfDay, startOfDay } from 'date-fns';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import * as Table from 'components/Common/Table';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { useCustomer } from 'providers/CustomerProvider';
import SearchBar from 'components/SearchBar/SearchBar';
import Searchbar from 'components/SearchBar';
import useAuth from 'hooks/useAuth';

import { PaginationSortByEnum, UserConnectionOrder, useGetPaginatedUsersLazyQuery } from 'types/generated-types';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { TabbedMenu } from 'components/Common/TabMenu';
import { formatSimpleDate } from 'utils/dateUtils';
import deleteUserQuery from '../../mutations/deleteUser';

const columns = 'minmax(150px, 1fr) minmax(200px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr)';

const UsersOverview = () => {
  const { canInviteUsers } = useAuth();
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const history = useHistory();
  const toast = useToast();
  const [fetchUsers, { data, refetch, loading: isLoading }] = useGetPaginatedUsersLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

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

  useEffect(() => {
    fetchUsers({
      variables: {
        customerSlug,
        filter: {
          startDate: filter.startDate ? filter.startDate.toISOString() : undefined,
          endDate: filter.endDate ? filter.endDate.toISOString() : undefined,
          search: filter.search,
          offset: filter.pageIndex * filter.perPage,
          perPage: filter.perPage,
          orderBy: { by: filter.orderByField as UserConnectionOrder, desc: filter.orderByDescending }, // sortBy,
        },
      },
    });
  }, [customerSlug, fetchUsers, filter]);

  const [deleteUser] = useMutation(deleteUserQuery, {
    onCompleted: () => {
      refetch?.({
        customerSlug,
        filter: {
          startDate: filter.startDate ? filter.startDate.toISOString() : undefined,
          endDate: filter.endDate ? filter.endDate.toISOString() : undefined,
          search: filter.search,
          offset: filter.pageIndex * filter.perPage,
          perPage: filter.perPage,
          orderBy: {
            by: filter.orderByField as UserConnectionOrder,
            desc: filter.orderByDescending,
          },
        },
      });
      toast({
        title: 'User removed!',
        description: 'The user has been removed from the workspace.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'An error ocurred!',
        description: 'It was not possible to remove user.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const handleDeleteUser = (event: any, userId: string) => {
    event.stopPropagation();

    deleteUser({
      variables: {
        input: {
          userId,
          customerId: activeCustomer?.id,
        },
      },
    });
  };

  const handleEditUser = (event: any, userId: string) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/u/${userId}/edit`);
  };

  const handleAddUser = (event: any) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/users/invite/`);
  };

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

  const handleRecipientFirstName = (firstName?: string | null) => {
    setFilter({ firstName, pageIndex: 0 });
  };

  const handleRecipientLastName = (lastName?: string | null) => {
    setFilter({ lastName, pageIndex: 0 });
  };

  const handleRecipientEmail = (email?: string | null) => {
    setFilter({ email, pageIndex: 0 });
  };

  const tableData = data?.customer?.usersConnection?.userCustomers?.map((userCustomer) => ({
    ...userCustomer.user,
    role: userCustomer.role,
  })) || [];

  console.log('Table data:', tableData);

  const pageCount = data?.customer?.usersConnection?.pageInfo?.nrPages || 0;

  return (
    <>
      <UI.ViewHead>
        <UI.Flex width="100%" justifyContent="space-between">
          <UI.Flex alignItems="center">
            <UI.ViewTitle leftIcon={<UsersIcon fill="currentColor" />}>{t('views:users_overview')}</UI.ViewTitle>
            <UI.Button
              isDisabled={!canInviteUsers}
              size="sm"
              ml={4}
              onClick={handleAddUser}
              leftIcon={Plus}
              variantColor="teal"
            >
              {t('invite_user')}
            </UI.Button>
          </UI.Flex>

          <SearchBar
            activeSearchTerm={filter.search}
            onSearchTermChange={handleSearchTermChange}
          />
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Div>
          <UI.Flex mb={2}>
            <PickerButton arrowBg="gray.50" label={t('add_filter')} icon={(<Plus />)}>
              {() => (
                <TabbedMenu
                  menuHeader={t('add_filter')}
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
                    <UI.SectionSubHeader>
                      {t('filter_by_updated_date_description')}
                    </UI.SectionSubHeader>
                    <UI.DatePicker
                      value={[filter.startDate, filter.endDate]}
                      onChange={handleDateChange}
                      range
                    />
                  </UI.Div>

                  <UI.Div>
                    <UI.Stack>
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
          </Table.HeadingRow>
          {tableData.map((user) => (
            <Table.Row
              // onClick={() => goToDeliveryView(campaignId, delivery.id)}
              isLoading={isLoading}
              key={user.id}
              gridTemplateColumns={columns}
            >
              <Table.Cell>
                <Table.InnerCell>
                  <UI.Helper>
                    {user?.firstName}
                  </UI.Helper>
                </Table.InnerCell>
              </Table.Cell>
              <Table.Cell>
                <Table.InnerCell>
                  <UI.Helper>
                    {user?.lastName}
                  </UI.Helper>
                </Table.InnerCell>
              </Table.Cell>
              <Table.Cell>
                <Table.InnerCell>
                  <UI.Helper>
                    {user?.email}
                  </UI.Helper>
                </Table.InnerCell>
              </Table.Cell>
              <Table.Cell>
                <UI.Helper>
                  {user?.role?.name}
                </UI.Helper>
                {/* <FormatTimestamp timestamp={delivery.updatedAt} /> */}
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
      </UI.ViewBody>
    </>
  );
};

export default UsersOverview;
