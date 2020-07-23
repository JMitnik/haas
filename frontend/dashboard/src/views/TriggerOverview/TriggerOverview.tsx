import { ApolloError } from 'apollo-boost';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, H2 } from '@haas/ui';
import { UserCell } from 'components/Table/CellComponents/CellComponents';
import SearchBar from 'components/SearchBar/SearchBar';
import Table from 'components/Table/Table';
import deleteTriggerMutation from 'mutations/deleteTrigger';
import getTriggerTableQuery from 'queries/getTriggerTable';

import { InputContainer, InputOutputContainer } from './TriggerOverviewStyles';
import Row from './TableRow/TriggerOverviewRow';

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
  { Header: 'NAME', accessor: 'name', Cell: UserCell },
  { Header: 'MEDIUM', accessor: 'medium', Cell: UserCell },
  { Header: 'TYPE', accessor: 'type', Cell: UserCell },
];

const TriggersOverview = () => {
  const { customerSlug } = useParams();
  const history = useHistory();
  const [fetchTriggers, { data }] = useLazyQuery(getTriggerTableQuery, { fetchPolicy: 'cache-and-network' });
  const [paginationProps, setPaginationProps] = useState<TableProps>(
    {
      activeStartDate: null,
      activeEndDate: null,
      activeSearchTerm: '',
      pageIndex: 0,
      pageSize: 8,
      sortBy: [{ by: 'name', desc: true }],
    },
  );

  const tableData: any = data?.triggerConnection?.triggers || [];
  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
    fetchTriggers({
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
  }, [customerSlug, fetchTriggers, paginationProps]);

  const [deleteTrigger] = useMutation(deleteTriggerMutation, {
    refetchQueries: [{ query: getTriggerTableQuery,
      variables: { customerSlug,
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

  const handleDeleteUser = (event: any, entryId: string) => {
    event.stopPropagation();
    deleteTrigger({
      variables: {
        id: entryId,
      },
    });
  };

  const handleEditEntry = (event: any, entryId: string) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/triggers/${entryId}/edit`);
  };

  const handleAddUser = (event: any) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/triggers/add/`);
  };

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const pageCount = data?.triggerTable?.totalPages || 1;
  const pageIndex = data?.triggerTable?.pageIndex || 0;

  return (
    <Div px="24px" margin="0 auto" height="100vh" maxHeight="100vh">
      <H2 color="#3653e8" fontWeight={400} mb="10%">Triggers</H2>
      <InputOutputContainer mb="5%">
        <InputContainer>
          <SearchBar activeSearchTerm={paginationProps.activeSearchTerm} onSearchTermChange={handleSearchTermChange} />
        </InputContainer>
      </InputOutputContainer>
      <Div backgroundColor="#fdfbfe" mb="1%" height="65%" overflowY="auto">
        <Table
          headers={HEADERS}
          paginationProps={{ ...paginationProps, pageCount, pageIndex }}
          onPaginationChange={setPaginationProps}
          onDeleteEntry={handleDeleteUser}
          onEditEntry={handleEditEntry}
          onAddEntry={handleAddUser}
          CustomRow={Row}
          data={tableData}
        />
      </Div>
    </Div>
  );
};

export default TriggersOverview;
