import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, Muted, Span } from '@haas/ui';
import DatePicker from 'components/DatePicker/DatePicker';
import InteractionsTable from 'components/Table/Table';
import SearchBar from 'components/SearchBar/SearchBar';
import getInteractionsQuery from 'queries/getInteractionsQuery';

import { CenterCell, ScoreCell, UserCell, WhenCell } from './TableCell/TableCell';
import { InputContainer, InputOutputContainer,
  InteractionsOverviewContainer, OutputContainer } from './InteractionOverviewStyles';
import Row from './TableRow/InteractionsTableRow';

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
  { Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
  { Header: 'PATHS', accessor: 'paths', Cell: CenterCell },
  { Header: 'USER', accessor: 'id', Cell: UserCell },
  { Header: 'WHEN', accessor: 'createdAt', Cell: WhenCell },
];

const InteractionsOverview = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [fetchInteractions, { data }] = useLazyQuery(getInteractionsQuery, {
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'score', desc: true }],
  });

  const interactions = data?.customer?.dialogue?.interactions?.sessions || [];

  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
    fetchInteractions({
      variables: {
        dialogueSlug,
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
  }, [paginationProps, fetchInteractions, dialogueSlug, customerSlug]);

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const handleDateChange = useCallback(debounce((startDate: Date | null, endDate: Date | null) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate }));
  }, 250), []);

  // TODO: Make this into a custom hook / utility function
  const handleExportCSV = (): void => {
    const csv = Papa.unparse(interactions);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    const currDate = new Date().getTime();

    tempLink.href = csvUrl;
    tempLink.setAttribute('download', `${currDate}-${customerSlug}-${dialogueSlug}.csv`);
    tempLink.click();
    tempLink.remove();
  };

  const pageCount = data?.customer?.dialogue?.interactions?.pages || 1;
  const pageIndex = data?.customer?.dialogue?.interactions?.pageIndex || 0;

  return (
    <InteractionsOverviewContainer>
      {/* TODO: Make a ViewTitle text-component */}
      <InputOutputContainer mb={4}>
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
            activeSearchTerm={paginationProps.activeSearchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </InputContainer>
      </InputOutputContainer>
      <Div backgroundColor="#fdfbfe" mb="1%" height="65%">
        <InteractionsTable
          headers={HEADERS}
          paginationProps={{ ...paginationProps, pageCount, pageIndex }}
          onPaginationChange={setPaginationProps}
          data={interactions}
          CustomRow={Row}
        />
      </Div>
    </InteractionsOverviewContainer>
  );
};

export default InteractionsOverview;
