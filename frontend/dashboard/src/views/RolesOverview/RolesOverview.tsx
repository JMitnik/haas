import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, H2 } from '@haas/ui';
import SearchBar from 'components/SearchBar/SearchBarComponent';
import Table from 'components/Table/Table';
import getRolesQuery from 'queries/getRolesTable';

import { CenterCell, UserCell } from 'components/Table/CellComponents/CellComponents';
import { InputContainer, InputOutputContainer } from './RolesOverviewStyles';
import Row from './TableRow/TableRow';

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

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const pageCount = data?.roleTable?.pages || 1;
  const pageIndex = data?.roleTable?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%">Roles and permissions</H2>
      <InputOutputContainer mb="5%">
        <InputContainer>
          <SearchBar activeSearchTerm={paginationProps.activeSearchTerm} onSearchTermChange={handleSearchTermChange} />
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
