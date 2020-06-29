import { debounce } from 'lodash';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, H2, Muted, Span } from '@haas/ui';
import DatePicker from 'components/DatePicker/DatePicker';
import InteractionsTable from 'components/Table/Table';
import SearchBar from 'components/SearchBar/SearchBar';
import getInteractionsQuery from 'queries/getInteractionsQuery';

import { ApolloError, ApolloQueryResult } from 'apollo-boost';
import { CenterCell, ScoreCell, UserCell, WhenCell } from './TableCell/TableCell';
import { InputContainer, InputOutputContainer, OutputContainer } from './InteractionOverviewStyles';
import Row from './TableRow/InteractionsTableRow';

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

interface FilterProps {
  startDate: Date | null;
  endDate: Date | null;
  searchTerm: string;
  pageIndex: number;
  limit: number;
  offset: number;
  orderBy: {
    id: string;
    desc: boolean;
  }[]
}

const HEADERS = [
  { Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
  { Header: 'PATHS', accessor: 'paths', Cell: CenterCell },
  { Header: 'USER', accessor: 'id', Cell: UserCell },
  { Header: 'WHEN', accessor: 'createdAt', Cell: WhenCell },
];

interface InteractionOverviewProps {
  interactions: Array<any>;
  pageCount: number;
  pageIndex: number;
  filter: FilterProps;
  refetchInteractions: (variables?: {
    dialogueId: any;
    filter: FilterProps;
  } | undefined) => Promise<ApolloQueryResult<any>>
  error: ApolloError | undefined;
  loading: boolean;
}

const InteractionsPage = () => {
  const { topicId } = useParams();
  const pageSize = 8;
  const pageIndex = 0;
  const filter: FilterProps = {
    startDate: null,
    endDate: null,
    searchTerm: '',
    pageIndex,
    offset: 0,
    limit: pageSize,
    orderBy: [{ id: 'id', desc: true }],
  };

  const { loading, error, data, refetch } = useQuery(getInteractionsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      dialogueId: topicId,
      filter,
    },
  });

  if (loading || !data) return null;

  const interactions = data?.interactions?.sessions || [];
  const pageCount = data?.interactions?.pages || 1;
  const newPageIndex = data?.interactions?.pageIndex || 0;

  return (
    <InteractionsOverview
      filter={filter}
      pageCount={pageCount}
      pageIndex={newPageIndex}
      interactions={interactions}
      refetchInteractions={refetch}
      loading={loading}
      error={error}
    />
  );
};

const InteractionsOverview = ({ interactions,
  pageCount,
  pageIndex,
  filter,
  refetchInteractions } : InteractionOverviewProps) => {
  const { topicId, customerId } = useParams();
  const { startDate, endDate, searchTerm, limit, orderBy, offset } = filter;

  const paginationProps = {
    activeStartDate: startDate,
    activeEndDate: endDate,
    activeSearchTerm: searchTerm,
    pageIndex,
    pageSize: limit,
    orderBy,
  };

  const handleSortChange = (accessor: string) => {
    console.log('handle sort change call');
    const newOrderBy = orderBy?.[0]?.id === accessor
      ? [{ id: orderBy?.[0]?.id, desc: !orderBy?.[0]?.desc }]
      : [{ id: accessor, desc: true }];
    refetchInteractions({
      dialogueId: topicId,
      filter: {
        startDate,
        endDate,
        searchTerm,
        offset,
        limit,
        pageIndex,
        orderBy: newOrderBy,
      },
    });
  };

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    console.log('handle search term change call');
    refetchInteractions({
      dialogueId: topicId,
      filter: {
        startDate,
        endDate,
        searchTerm: newSearchTerm,
        offset,
        limit,
        pageIndex,
        orderBy,
      },
    });
  }, 250), []);

  const handleDateChange = useCallback(debounce((newStartDate: Date | null, startEndDate: Date | null) => {
    console.log('handle date change call');
    refetchInteractions({
      dialogueId: topicId,
      filter: {
        startDate: newStartDate,
        endDate: startEndDate,
        searchTerm,
        offset,
        limit,
        pageIndex,
        orderBy,
      },
    });
  }, 250), []);

  const handlePageChange = (newPageIndex: number) => {
    console.log('handle page change call');
    refetchInteractions({
      dialogueId: topicId,
      filter: {
        startDate,
        endDate,
        searchTerm,
        offset,
        limit,
        pageIndex: newPageIndex,
        orderBy,
      },
    });
  };

  // TODO: Make this into a custom hook / utility function
  const handleExportCSV = (): void => {
    const csv = Papa.unparse(interactions);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    const currDate = new Date().getTime();

    tempLink.href = csvUrl;
    tempLink.setAttribute('download', `${currDate}-${customerId}-${topicId}.csv`);
    tempLink.click();
    tempLink.remove();
  };

  console.log('render');

  return (
    <Div px="24px" py="24px" margin="0 auto" width="80%" maxHeight="100vh" overflow="scroll">
      {/* TODO: Make a ViewTitle text-component */}
      <H2 color="#3653e8" fontWeight={400} mb="10%"> Interactions </H2>
      <InputOutputContainer mb="5%">
        <OutputContainer>
          <Div justifyContent="center" marginRight="15px">
            <Muted fontWeight="bold">Exports</Muted>
          </Div>
          {/* TODO: Make a button component out of this */}
          <Div
            padding="8px 36px"
            borderRadius="90px"
            style={{ cursor: 'pointer' }}
            onClick={handleExportCSV}
            useFlex
            flexDirection="row"
            alignItems="center"
            backgroundColor="#c4c4c4"
          >
            <Span fontWeight="bold">CSV</Span>
          </Div>
        </OutputContainer>
        <InputContainer>
          <DatePicker
            activeStartDate={paginationProps.activeStartDate}
            activeEndDate={paginationProps.activeEndDate}
            onDateChange={handleDateChange}
          />
          <SearchBar
            onSearchTermChange={handleSearchTermChange}
          />
        </InputContainer>
      </InputOutputContainer>
      <Div backgroundColor="#fdfbfe" mb="1%" height="65%">
        <InteractionsTable
          headers={HEADERS}
          paginationProps={{ ...paginationProps, pageCount, pageIndex }}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          data={interactions}
          CustomRow={Row}
        />
      </Div>
    </Div>
  );
};

export default InteractionsPage;
