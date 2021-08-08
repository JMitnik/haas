import * as UI from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { Plus } from 'react-feather';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/core';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';

import { GenericCell, RoleCell } from 'components/Table/CellComponents/CellComponents';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-user-group.svg';
import { useCustomer } from 'providers/CustomerProvider';
import SearchBar from 'components/SearchBar/SearchBar';
import ShowMoreButton from 'components/ShowMoreButton';
import Table from 'components/Table/Table';
import getPaginatedUsers from 'queries/getPaginatedUsers';
import useAuth from 'hooks/useAuth';

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

const HEADERS = [
  { Header: 'first_name', accessor: 'firstName', Cell: GenericCell },
  { Header: 'last_name', accessor: 'lastName', Cell: GenericCell },
  { Header: 'email', accessor: 'email', Cell: GenericCell },
  { Header: 'role', accessor: 'role', Cell: RoleCell },
];

const UsersOverview = () => {
  const { canDeleteUsers, canInviteUsers, canEditUsers } = useAuth();
  const { activeCustomer } = useCustomer();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const history = useHistory();
  const toast = useToast();
  const [fetchUsers, { data, refetch }] = useLazyQuery(getPaginatedUsers, {
    fetchPolicy: 'cache-and-network',
  });

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'email', desc: true }],
  });

  const tableData: any = data?.customer?.usersConnection?.userCustomers?.map((userCustomer: any) => ({
    ...userCustomer.user,
    role: userCustomer.role,
  })) || [];

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
          startDate: activeStartDate,
          endDate: activeEndDate,
          searchTerm: activeSearchTerm,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex,
          orderBy: sortBy,
        },
      },
    });
  }, [customerSlug, fetchUsers, paginationProps]);

  const [deleteUser] = useMutation(deleteUserQuery, {
    onCompleted: () => {
      refetch?.({
        customerSlug,
        filter: {
          startDate: paginationProps.activeStartDate,
          endDate: paginationProps.activeEndDate,
          searchTerm: paginationProps.activeSearchTerm,
          offset: paginationProps.pageIndex * paginationProps.pageSize,
          limit: paginationProps.pageSize,
          pageIndex: paginationProps.pageIndex,
          orderBy: paginationProps.sortBy,
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

  const handleSearchTermChange = useCallback(
    debounce((newSearchTerm: string) => {
      setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
    }, 250),
    [],
  );

  const pageCount = data?.userTable?.pageInfo?.nrPages || 1;
  const pageIndex = data?.userTable?.pageInfo?.pageIndex || 0;

  return (
    <>
      <UI.ViewHead>
        <UI.Flex width="100%" justifyContent="space-between">
          <UI.Flex alignItems="center">
            <UI.ViewTitle leftIcon={<UsersIcon fill="currentColor" />}>{t('views:users_overview')}</UI.ViewTitle>
            {canInviteUsers && (
              <UI.Button size="sm" ml={4} onClick={handleAddUser} leftIcon={Plus} variantColor="teal">
                {t('invite_user')}
              </UI.Button>
            )}
          </UI.Flex>

          <SearchBar
            activeSearchTerm={paginationProps.activeSearchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>

        <UI.Div borderRadius="lg" flexGrow={1} backgroundColor="white" mb="1%">
          <ErrorBoundary
            FallbackComponent={() => (
              <UI.Div>
                We are experiencing some maintenance with the Users data. We will be back shortly.
              </UI.Div>
            )}
          >
            <Table
              headers={HEADERS}
              paginationProps={{ ...paginationProps, pageCount, pageIndex }}
              onPaginationChange={setPaginationProps}
              data={tableData}
              renderOptions={(usersData: any) => (
                <>
                  {canDeleteUsers && (
                    <ShowMoreButton
                      renderMenu={(
                        <UI.List>
                          <UI.ListHeader>{t('edit_user')}</UI.ListHeader>
                          {canDeleteUsers && (
                            <>
                              {canEditUsers && (
                                <UI.ListItem onClick={(e: any) => handleEditUser(e, usersData?.id)}>
                                  {t('edit_user')}
                                </UI.ListItem>
                              )}
                              <Popover>
                                {() => (
                                  <>
                                    <PopoverTrigger>
                                      <UI.ListItem>{t('delete_user')}</UI.ListItem>
                                    </PopoverTrigger>
                                    <PopoverContent zIndex={4}>
                                      <PopoverArrow />
                                      <PopoverHeader>{t('delete')}</PopoverHeader>
                                      <PopoverCloseButton />
                                      <PopoverBody>
                                        <UI.Text>{t('delete_user_popover')}</UI.Text>
                                      </PopoverBody>
                                      <PopoverFooter>
                                        <UI.Button
                                          variantColor="red"
                                          onClick={(e: any) => handleDeleteUser(e, usersData?.id)}
                                        >
                                          {t('delete')}
                                        </UI.Button>
                                      </PopoverFooter>
                                    </PopoverContent>
                                  </>
                                )}
                              </Popover>
                            </>
                          )}
                        </UI.List>
                      )}
                    />
                  )}
                </>
              )}
            />
          </ErrorBoundary>
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};

export default UsersOverview;
