import { ApolloError } from 'apollo-boost';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, H2 } from '@haas/ui';
import DatePicker from 'components/DatePicker/DatePicker';
import SearchBar from 'components/SearchBar/SearchBar';
import Table from 'components/Table/Table';
import getUsersQuery from 'queries/getUserTable';

import { CenterCell, RoleCell, UserCell } from 'components/Table/CellComponents/CellComponents';
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
    id: string;
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
  const { customerId } = useParams();
  const history = useHistory();
  const [fetchUsers, { data }] = useLazyQuery(getUsersQuery, { fetchPolicy: 'cache-and-network' });
  const [paginationProps, setPaginationProps] = useState<TableProps>(
    {
      activeStartDate: null,
      activeEndDate: null,
      activeSearchTerm: '',
      pageIndex: 0,
      pageSize: 8,
      sortBy: [{ id: 'id', desc: true }],
    },
  );

  const tableData: any = data?.userTable.users || [];
  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
    fetchUsers({
      variables: {
        customerId,
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
  }, [customerId, fetchUsers, paginationProps]);

  const [deleteUser] = useMutation(deleteUserQuery, {
    refetchQueries: [{ query: getUsersQuery,
      variables: { customerId,
        filter: {
          startDate: paginationProps.activeStartDate,
          endDate: paginationProps.activeEndDate,
          searchTerm: paginationProps.activeSearchTerm,
          offset: paginationProps.pageIndex * paginationProps.pageSize,
          limit: paginationProps.pageSize,
          pageIndex: paginationProps.pageIndex,
          orderBy: paginationProps.sortBy,
        } } }],
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
    history.push(`/dashboard/c/${customerId}/u/${userId}/edit`);
  };

  const handleAddUser = (event: any) => {
    event.stopPropagation();
    history.push(`/dashboard/c/${customerId}/users/add/`);
  };

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const handleDateChange = useCallback(debounce((startDate: Date | null, endDate: Date | null) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate }));
  }, 250), []);

  const pageCount = data?.userTable?.totalPages || 1;
  const pageIndex = data?.userTable?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%">Users and roles</H2>
      <InputOutputContainer mb="5%">
        <InputContainer>
          <DatePicker
            activeStartDate={paginationProps.activeStartDate}
            activeEndDate={paginationProps.activeEndDate}
            onDateChange={handleDateChange}
          />
          <SearchBar activeSearchTerm={paginationProps.activeSearchTerm} onSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
      <Div backgroundColor="#fdfbfe" mb="1%" height="65%">
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
      </Div>
    </Div>
  );
};

export default UsersOverview;
