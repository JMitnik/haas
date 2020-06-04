import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';

import { Div, H2 } from '@haas/ui';
import DatePickerComponent from 'components/DatePicker/DatePickerComponent';
import SearchBarComponent from 'components/SearchBar/SearchBarComponent';
import UsersTable from 'views/UsersOverview/UsersTable';
import getInteractionsQuery from 'queries/getInteractionsQuery'

import { CenterCell, ScoreCell, UserCell, WhenCell } from 'components/Table/CellComponents/CellComponents';
import { InputContainer, InputOutputContainer } from './UsersOverviewStyles';

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
{ Header: 'Last name', accessor: 'lastName', Cell: CenterCell }, { Header: 'Email', accessor: 'email', Cell: CenterCell }, { Header: 'Role', accessor: 'role', Cell: CenterCell }]

const UsersOverview = () => {
  const { customerId } = useParams();
  const [fetchInteractions, { loading, data }] = useLazyQuery(getInteractionsQuery, { fetchPolicy: 'cache-and-network' });
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

  const interactions = data?.interactions?.sessions || []

//   useEffect(() => {
//     const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = activeGridProperties;
//     fetchInteractions({
//       variables: {
//         dialogueId: topicId,
//         filter: {
//           startDate: activeStartDate,
//           endDate: activeEndDate,
//           searchTerm: activeSearchTerm,
//           offset: pageIndex * pageSize,
//           limit: pageSize,
//           pageIndex,
//           orderBy: sortBy,
//         },
//       },
//     })
//   }, [activeGridProperties])

  const handleSearchTermChange = (newSearchTerm: string) => {
    setActiveGridProperties((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setActiveGridProperties((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate }))
  }

  const pageCount = data?.interactions?.pages || 1;
  const pageIndex = data?.interactions?.pageIndex || 0;

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
        <UsersTable
          headers={HEADERS}
          gridProperties={{ ...activeGridProperties, pageCount, pageIndex }}
          onGridPropertiesChange={setActiveGridProperties}
          data={interactions}
        />
      </Div>
    </Div>
  )
}

export default UsersOverview;
