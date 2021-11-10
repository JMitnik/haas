import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { BooleanParam, DateTimeParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Calendar, Plus, Search, User } from 'react-feather';
import { Route, Switch, useHistory, useLocation, useParams } from 'react-router';
import { endOfDay, startOfDay } from 'date-fns';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Menu from 'components/Common/Menu';
import * as Table from 'components/Common/Table';
import { Avatar } from 'components/Common/Avatar';
import { FormatTimestamp } from 'components/Common/DateAndTime';
import {
  GetPaginatedUsersQuery,
  PaginationSortByEnum,
  UserConnectionOrder,
  useDeleteUserMutation,
  useGetPaginatedUsersQuery,
  useHandleUserStateInWorkspaceMutation,
} from 'types/generated-types';
import { PickerButton } from 'components/Common/Picker/PickerButton';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { TabbedMenu } from 'components/Common/TabMenu';
import { TableCellButtonContainer } from 'components/Common/Table';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { formatSimpleDate } from 'utils/dateUtils';
import { useCustomer } from 'providers/CustomerProvider';
import { useMenu } from 'components/Common/Menu/useMenu';
import SearchBar from 'components/SearchBar/SearchBar';
import Searchbar from 'components/SearchBar';
import useAuth from 'hooks/useAuth';

import { PopoverItem } from './UsersOverviewStyles';
import { UserModalCard } from './UserModalCard';
import InviteUserButton from './InviteUserButton';
import InviteUserForm from './InviteUserForm';
import RoleUserModalCard from './RoleUserModalCard';

const columns = `
  minmax(50px, 1fr) 
  minmax(50px, 1fr) 
  minmax(200px, 1fr) 
  minmax(30px, 1fr) 
  minmax(50px, 1fr) 
  minmax(50px, 1fr) 
  minmax(50px, 1fr)
  `;

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

interface ContextualMenuProps {
  userId: string;
}

const UsersOverview = () => {
  const { canAccessAdmin, canEditUsers, canDeleteUsers } = useAuth();
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { goToUserView, goToUsersOverview, goToRoleUserView, userOverviewMatch } = useNavigator();
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();

  const { menuProps, openMenu, closeMenu, activeItem: contextUser } = useMenu<ContextualMenuProps>();

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

  const [setUserAccessibility] = useHandleUserStateInWorkspaceMutation({
    onCompleted: (userOfCustomer) => {
      const email = userOfCustomer?.handleUserStateInWorkspace?.user?.email;
      const state = userOfCustomer?.handleUserStateInWorkspace?.isActive ? t('active') : t('inactive');
      toast({
        title: 'User accessibility changed!',
        description: `User with email ${email} has been set to ${state}`,
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
      handleRefetch();
    },
  });

  const [deleteUser] = useDeleteUserMutation({
    onCompleted: () => {
      toast({
        title: 'User removed!',
        description: 'The user has been removed from the workspace.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
      handleRefetch();
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

  const handleDeleteUser = (userId: string) => {
    deleteUser({
      variables: {
        input: {
          userId,
          customerId: activeCustomer?.id,
        },
      },
    });
  };

  const handleEditUser = (userId: string) => {
    history.push(`/dashboard/b/${customerSlug}/u/${userId}/edit`);
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
    ...userCustomer.user,
    isActive: userCustomer.isActive,
    createdAt: userCustomer.createdAt,
    userId: userCustomer.user.id,
    role: userCustomer.role,
  })) || [];

  const pageCount = activePaginatedUsersResult?.customer?.usersConnection?.totalPages || 0;

  return (
    <>
      <UI.ViewHead>
        <UI.Flex width="100%" justifyContent="space-between">
          <UI.Flex alignItems="center">
            <UI.ViewTitle leftIcon={<UsersIcon fill="currentColor" />}>{t('views:users_overview')}</UI.ViewTitle>
            <InviteUserButton label="">
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
            <Table.HeadingCell>
              {t('last_logged_in')}
            </Table.HeadingCell>
            <Table.HeadingCell>
              {t('user_workspace_access')}
            </Table.HeadingCell>
          </Table.HeadingRow>
          <Menu.Base
            {...menuProps}
            onClose={closeMenu}
          >
            <Menu.Header>
              {t('filter')}
            </Menu.Header>

            <Menu.Item
              disabled={!canDeleteUsers && !canAccessAdmin}
              onClick={() => handleEditUser(contextUser?.userId || '')}
            >
              {t('edit_user')}
            </Menu.Item>
            <Menu.Item
              disabled={tableData.length === 1 || (!canEditUsers && !canAccessAdmin)}
              onClick={() => handleDeleteUser(contextUser?.userId || '')}
            >
              {t('delete_user')}
            </Menu.Item>
          </Menu.Base>
          {tableData.map((user) => (
            <Table.Row
              onContextMenu={(e) => openMenu(e, { userId: user.userId })}
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

                <Table.InnerCell isDisabled={!canAccessAdmin && !canEditUsers}>
                  <UI.Div onClick={() => goToRoleUserView(user.id, user.role.id)}>
                    <UI.Helper>
                      {user?.role?.name}
                    </UI.Helper>
                  </UI.Div>
                </Table.InnerCell>

              </Table.Cell>

              <Table.Cell>
                <FormatTimestamp timestamp={user.createdAt} />
              </Table.Cell>

              <Table.Cell>
                {user.lastLoggedIn ? <FormatTimestamp timestamp={user.lastLoggedIn} /> : <UI.Helper>Never</UI.Helper>}
              </Table.Cell>

              <Table.Cell>
                <Table.InnerCell
                  isDisabled={!canAccessAdmin && !canEditUsers}
                  header="User Workspace Access"
                  brand={user?.isActive ? 'green' : 'red'}
                  renderBody={() => (
                    <UI.Stack spacing={1}>
                      <PopoverItem>
                        <UI.Text>Set access of this user to: </UI.Text>
                        <UI.Flex justifyContent="center">
                          <TableCellButtonContainer
                            onClick={() => setUserAccessibility({
                              variables: {
                                input: {
                                  isActive: !user.isActive,
                                  userId: user.userId,
                                  workspaceId: activeCustomer?.id,
                                },
                              },
                            })}
                            as="button"
                            py={1}
                            px={2}
                            borderRadius={10}
                            border="1px solid"
                            borderColor="gray.100"
                            bg={user?.isActive ? 'red.100' : 'green.100'}
                          >
                            <UI.Helper color={user?.isActive ? 'red.600' : 'green.600'}>
                              {user?.isActive ? t('inactive') : t('active')}
                            </UI.Helper>
                          </TableCellButtonContainer>
                        </UI.Flex>

                      </PopoverItem>

                    </UI.Stack>
                  )}
                >
                  <UI.Helper color={user?.isActive ? 'green.600' : 'red.600'}>
                    {user?.isActive ? t('active') : t('inactive')}
                  </UI.Helper>
                </Table.InnerCell>
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
        {!userOverviewMatch?.isExact && (
          <AnimatePresence>
            <Switch
              location={location}
              key={location.pathname}
            >
              <Route
                path={ROUTES.ROLE_USER_VIEW}
              >
                {({ match }) => (
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UI.Modal isOpen onClose={() => goToUsersOverview()}>
                      <RoleUserModalCard
                        onClose={() => goToUsersOverview()}
                        // @ts-ignore
                        id={match?.params?.roleId}
                        // @ts-ignore
                        userId={match?.params?.userId}
                      />
                    </UI.Modal>
                  </motion.div>
                )}
              </Route>

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
        )}

      </UI.ViewBody>
    </>
  );
};

export default UsersOverview;
