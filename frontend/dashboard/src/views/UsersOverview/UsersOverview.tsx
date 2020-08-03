import { ApolloError } from 'apollo-boost';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, PageHeading } from '@haas/ui';
import SearchBar from 'components/SearchBar/SearchBar';
import Table from 'components/Table/Table';
import getUsersQuery from 'queries/getUserTable';

import { CenterCell, RoleCell, UserCell } from 'components/Table/CellComponents/CellComponents';
import { ErrorBoundary } from 'react-error-boundary';
import { InputContainer, InputOutputContainer } from './UsersOverviewStyles';
import Row from './TableRow/UsersTableRow';
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
  { Header: 'First name', accessor: 'firstName', Cell: CenterCell },
  { Header: 'Last name', accessor: 'lastName', Cell: CenterCell },
  { Header: 'Email', accessor: 'email', Cell: UserCell },
  { Header: 'Role', accessor: 'role', Cell: RoleCell },
];

const UsersOverview = () => {
  const { customerSlug } = useParams();
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

  const handleDeleteUser = (event: any, userId: string) => {
    deleteUser({
      variables: {
        id: userId,
      },
    });
  };

  const handleEditUser = (event: any, userId: string) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/u/${userId}/edit`);
  };

  const handleAddUser = (event: any) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/users/add/`);
  };

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const pageCount = data?.userTable?.totalPages || 1;
  const pageIndex = data?.userTable?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" height="100vh" maxHeight="100vh">
      <PageHeading fontWeight={400} mb="4">Users and roles</PageHeading>
      <InputOutputContainer mb="5%">
        <InputContainer>
          <SearchBar activeSearchTerm={paginationProps.activeSearchTerm} onSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
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
            CustomRow={Row}
            data={tableData}
          />
        </ErrorBoundary>
      </Div>
    </Div>
  );
};

export default UsersOverview;
