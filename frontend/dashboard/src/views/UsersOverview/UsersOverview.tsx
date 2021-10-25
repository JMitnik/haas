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

import { PaginationSortByEnum, useGetPaginatedUsersLazyQuery } from 'types/generated-types';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { TabbedMenu } from 'components/Common/TabMenu';
import { formatSimpleDate } from 'utils/dateUtils';
import deleteUserQuery from '../../mutations/deleteUser';

interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
  sortBy: {
    by: string;
    desc: boolean;
  }[];
}

const columns = 'minmax(150px, 1fr) minmax(200px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr)';

const UsersOverview = () => {
  const { canDeleteUsers, canInviteUsers, canEditUsers } = useAuth();
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
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
    recipientEmail: StringParam,
    recipientPhone: StringParam,
    recipientFirstName: StringParam,
    recipientLastName: StringParam,
    status: StringParam,
    orderByField: withDefault(StringParam, PaginationSortByEnum.CreatedAt),
    orderByDescending: withDefault(BooleanParam, true),
  });

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'email', desc: true }],
  });

  useEffect(() => {
    const {
      activeStartDate,
      activeEndDate,
      pageIndex,
      pageSize,
      sortBy,
      activeSearchTerm,
    } = paginationProps;
    fetchUsers({
      variables: {
        customerSlug,
        filter: {
          startDate: null, // activeStartDate,
          endDate: null, // activeEndDate,
          searchTerm: activeSearchTerm,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex,
          orderBy: [{ by: PaginationSortByEnum.FirstName, desc: true }], // sortBy,
        },
      },
    });
  }, [customerSlug, fetchUsers, paginationProps]);

  const [deleteUser] = useMutation(deleteUserQuery, {
    onCompleted: () => {
      refetch?.({
        customerSlug,
        filter: {
          startDate: null, // paginationProps.activeStartDate,
          endDate: null, // paginationProps.activeEndDate,
          searchTerm: paginationProps.activeSearchTerm,
          offset: paginationProps.pageIndex * paginationProps.pageSize,
          limit: paginationProps.pageSize,
          pageIndex: paginationProps.pageIndex,
          orderBy: [{ by: PaginationSortByEnum.FirstName, desc: true }], // paginationProps.sortBy,
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

  const handleRecipientFirstName = (firstName?: string | null) => {
    setFilter({ recipientFirstName: firstName, pageIndex: 0 });
  };

  const handleRecipientLastName = (lastName?: string | null) => {
    setFilter({ recipientLastName: lastName, pageIndex: 0 });
  };

  const handleRecipientEmail = (email?: string | null) => {
    setFilter({ recipientEmail: email, pageIndex: 0 });
  };

  const handleRecipientPhone = (phone?: string | null) => {
    setFilter({ recipientPhone: phone, pageIndex: 0 });
  };

  const handleStatus = (status?: string | null) => {
    setFilter({ status, pageIndex: 0 });
  };

  const tableData = data?.customer?.usersConnection?.userCustomers?.map((userCustomer) => ({
    ...userCustomer.user,
    role: userCustomer.role,
  })) || [];

  console.log('Table data:', tableData);

  const pageCount = data?.customer?.usersConnection?.pageInfo?.nrPages || 0;
  const pageIndex = data?.customer?.usersConnection?.pageInfo?.pageIndex || 0;

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
                          activeSearchTerm={filter.recipientFirstName}
                          onSearchTermChange={handleRecipientFirstName}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_last_name')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientLastName}
                          onSearchTermChange={handleRecipientLastName}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_email')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientEmail}
                          onSearchTermChange={handleRecipientEmail}
                        />
                      </UI.Div>
                      <UI.Div>
                        <UI.RadioHeader>
                          {t('filter_by_recipient_phone')}
                        </UI.RadioHeader>
                        <Searchbar
                          activeSearchTerm={filter.recipientPhone}
                          onSearchTermChange={handleRecipientPhone}
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
                condition={!!filter.recipientFirstName}
                filterKey="recipientFirstName"
                value={filter.recipientFirstName}
                onClose={() => handleRecipientFirstName('')}
              />
              <Table.FilterButton
                condition={!!filter.recipientLastName}
                filterKey="recipientLastName"
                value={filter.recipientLastName}
                onClose={() => handleRecipientLastName('')}
              />
              <Table.FilterButton
                condition={!!(filter.startDate || filter.endDate)}
                filterKey="updatedAt"
                value={`${formatSimpleDate(filter.startDate?.toISOString())} - ${formatSimpleDate(filter.endDate?.toISOString())}`}
                onClose={() => handleMultiDateFilterChange(undefined, undefined)}
              />
              <Table.FilterButton
                condition={!!filter.recipientEmail}
                filterKey="recipientEmail"
                value={filter.recipientEmail}
                onClose={() => handleRecipientEmail('')}
              />
              <Table.FilterButton
                condition={!!filter.recipientPhone}
                filterKey="recipientPhone"
                value={filter.recipientPhone}
                onClose={() => handleRecipientPhone('')}
              />
              <Table.FilterButton
                condition={!!filter.status}
                filterKey="status"
                value={filter.status}
                onClose={() => handleStatus(undefined)}
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
