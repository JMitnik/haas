import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';

import { Div, H2 } from '@haas/ui';
import DatePickerComponent from 'components/DatePicker/DatePickerComponent';
import SearchBarComponent from 'components/SearchBar/SearchBarComponent';
import Table from 'components/Table/Table';
import getRolesQuery from 'queries/getRolesTable';

import { CenterCell, RoleCell, ScoreCell, UserCell, WhenCell } from 'components/Table/CellComponents/CellComponents';
import { InputContainer, InputOutputContainer } from './RolesOverviewStyles';
import Row from './RowComponent/RowComponent';

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
  { Header: 'ID', accessor: 'id', Cell: UserCell },
  { Header: 'NAME', accessor: 'name', Cell: UserCell },
  { Header: '# PERMISSIONS', accessor: 'amtPermissions', Cell: CenterCell },
];

const RolesOverview = () => {
  const { customerId } = useParams();
  const [fetchRoles, { loading, data }] = useLazyQuery(getRolesQuery, { fetchPolicy: 'cache-and-network' });
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

  const tableData: any = data?.roleTable?.roles || [];
  const permissions: any = data?.roleTable?.permissions || [];

  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
    fetchRoles({
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
  }, [customerId, fetchRoles, paginationProps]);

  const handleSearchTermChange = (newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  };

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate }));
  };

  const pageCount = data?.roleTable?.pages || 1;
  const pageIndex = data?.roleTable?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%">Roles and permissions</H2>
      <InputOutputContainer mb="5%">
        <InputContainer>
          <DatePickerComponent
            activeStartDate={paginationProps.activeStartDate}
            activeEndDate={paginationProps.activeEndDate}
            handleDateChange={handleDateChange}
          />
          <SearchBarComponent activeSearchTerm={paginationProps.activeSearchTerm} handleSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
      <Div backgroundColor="#fdfbfe" mb="1%" height="65%">
        <Table
          headers={HEADERS}
          gridProperties={{ ...paginationProps, pageCount, pageIndex }}
          onPaginationChange={setPaginationProps}
          data={tableData}
          permissions={permissions}
          CustomRow={Row}
        />
      </Div>
    </Div>
  );
};

export default RolesOverview;
