import { ApolloError } from 'apollo-boost';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, Flex, PageTitle } from '@haas/ui';
import SearchBar from 'components/SearchBar/SearchBar';
import Table from 'components/Table/Table';
import getUsersQuery from 'queries/getUserTable';

import { Button } from '@chakra-ui/core';
import { ErrorBoundary } from 'react-error-boundary';
import { GenericCell, RoleCell } from 'components/Table/CellComponents/CellComponents';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
// import Row from './TableRow/UsersTableRow';
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
  }[]
}

const HEADERS = [
  { Header: 'first_name', accessor: 'firstName', Cell: GenericCell },
  { Header: 'last_name', accessor: 'lastName', Cell: GenericCell },
  { Header: 'email', accessor: 'email', Cell: GenericCell },
  { Header: 'role', accessor: 'role', Cell: RoleCell },
];

const UsersOverview = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const history = useHistory();
  const [fetchUsers, { data }] = useLazyQuery(getUsersQuery, { fetchPolicy: 'cache-and-network' });

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'email', desc: true }],
  });

  const tableData: any = data?.userTable.users || [];

  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
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
    refetchQueries: [{
      query: getUsersQuery,
      variables: {
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
      },
    }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const handleDeleteUser = (event: any, userId: string, onComplete: (() => void) | undefined) => {
    deleteUser({
      variables: {
        id: userId,
      },
    }).finally(() => onComplete && onComplete());
  };

  const handleEditUser = (event: any, userId: string) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/u/${userId}/edit`);
  };

  const handleAddUser = (event: any) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/users/invite/`);
  };

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const pageCount = data?.userTable?.totalPages || 1;
  const pageIndex = data?.userTable?.pageIndex || 0;

  return (
    <>
      <PageTitle>{t('views:users_overview')}</PageTitle>

      <Div mb={4} width="100%">
        <Flex justifyContent="space-between">
          <Div mr={4}>
            <Button onClick={handleAddUser} leftIcon={Plus} variantColor="teal">{t('invite_user')}</Button>
          </Div>
          <Div>
            <SearchBar
              activeSearchTerm={paginationProps.activeSearchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
          </Div>
        </Flex>
      </Div>

      <Div borderRadius="lg" flexGrow={1} backgroundColor="white" mb="1%">
        <ErrorBoundary FallbackComponent={() => (
          <Div>
            We are experiencing some maintenance with the Users data. We will be back shortly.
          </Div>
        )}
        >
          <Table
            headers={HEADERS}
            paginationProps={{ ...paginationProps, pageCount, pageIndex }}
            onPaginationChange={setPaginationProps}
            onDeleteEntry={handleDeleteUser}
            onEditEntry={handleEditUser}
            onAddEntry={handleAddUser}
            data={tableData}
          />
        </ErrorBoundary>
      </Div>
    </>
  );
};

export default UsersOverview;
