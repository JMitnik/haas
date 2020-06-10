import { ApolloError } from 'apollo-boost';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';

import { Div, H2 } from '@haas/ui';
import DatePickerComponent from 'components/DatePicker/DatePickerComponent';
import SearchBarComponent from 'components/SearchBar/SearchBarComponent';
import getUsersQuery from 'queries/getUsers';

import { CenterCell, RoleCell, ScoreCell, UserCell, WhenCell } from 'components/Table/CellComponents/CellComponents';
import { InputContainer, InputOutputContainer } from './UsersOverviewStyles';
import Table from './UserTable';
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

const HEADERS = [{ Header: 'First name', accessor: 'firstName', Cell: CenterCell },
  { Header: 'Last name', accessor: 'lastName', Cell: CenterCell }, { Header: 'Email', accessor: 'email', Cell: UserCell }, { Header: 'Role', accessor: 'role', Cell: RoleCell }];

const UsersOverview = () => {
  const { customerId } = useParams();
  const [fetchUsers, { loading, data }] = useLazyQuery(getUsersQuery, { fetchPolicy: 'cache-and-network' });
  const [activeGridProperties, setActiveGridProperties] = useState<TableProps>(
    {
      activeStartDate: null,
      activeEndDate: null,
      activeSearchTerm: '',
      pageIndex: 0,
      pageSize: 8,
      sortBy: [{ id: 'id', desc: true }],
    },
  );

  const [deleteUser] = useMutation(deleteUserQuery, {
    refetchQueries: [{ query: getUsersQuery, variables: { customerId } }], // TODO: Add filter object
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const tableData: any = data?.users || [];
  console.log('USERS: ', data?.users);
  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = activeGridProperties;
    fetchUsers({
      variables: {
        customerId,
        // filter: {
        //   startDate: activeStartDate,
        //   endDate: activeEndDate,
        //   searchTerm: activeSearchTerm,
        //   offset: pageIndex * pageSize,
        //   limit: pageSize,
        //   pageIndex,
        //   orderBy: sortBy,
        // },
      },
    });
  }, [activeGridProperties]);

  const handleDeleteUser = async (event: any, userId: string) => {
    deleteUser({
      variables: {
        id: userId,
      },
    });
    event.stopPropagation();
  };

  const handleSearchTermChange = (newSearchTerm: string) => {
    setActiveGridProperties((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  };

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setActiveGridProperties((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate }));
  };

  const pageCount = data?.getUsers?.pages || 1;
  const pageIndex = data?.getUsers?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%">Users and roles</H2>
      <InputOutputContainer mb="5%">
        <InputContainer>
          <DatePickerComponent
            activeStartDate={activeGridProperties.activeStartDate}
            activeEndDate={activeGridProperties.activeEndDate}
            handleDateChange={handleDateChange}
          />
          <SearchBarComponent activeSearchTerm={activeGridProperties.activeSearchTerm} handleSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
      <Div backgroundColor="#fdfbfe" mb="1%" height="65%">
        <Table
          headers={HEADERS}
          gridProperties={{ ...activeGridProperties, pageCount, pageIndex }}
          onGridPropertiesChange={setActiveGridProperties}
          onDeleteUser={handleDeleteUser}
          data={tableData}
        />
      </Div>
    </Div>
  );
};

export default UsersOverview;
