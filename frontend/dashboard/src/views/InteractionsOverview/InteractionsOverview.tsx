import { debounce, maxBy } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';

import {
  getDialogueSessionConnection as CustomerSessionConnection,
} from 'queries/__generated__/getDialogueSessionConnection';
import { Div, Flex, Muted, PageTitle, Span } from '@haas/ui';
import DatePicker from 'components/DatePicker/DatePicker';
import InteractionsTable from 'components/Table/Table';
import SearchBar from 'components/SearchBar/SearchBar';
import getDialogueSessionConnectionQuery from 'queries/getDialogueSessionConnectionQuery';

import { Activity, Download } from 'react-feather';
import { Button, Icon } from '@chakra-ui/core';
import { CenterCell, InteractionCTACell, InteractionDateCell, InteractionUserCell, ScoreCell, UserCell, WhenCell } from './TableCell/TableCell';
import { InputContainer, InputOutputContainer,
  InteractionsOverviewContainer, OutputContainer } from './InteractionOverviewStyles';
import { useTranslation } from 'react-i18next';
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
  { Header: 'User', accessor: 'id', Cell: InteractionUserCell },
  { Header: 'Date', accessor: 'createdAt', Cell: InteractionDateCell },
  { Header: 'Call-to-action', accessor: 'nodeEntries', Cell: InteractionCTACell },
  { Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
];

const InteractionsOverview = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [fetchInteractions, { data, loading }] = useLazyQuery<CustomerSessionConnection>(getDialogueSessionConnectionQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'score', desc: true }],
  });

  const sessions = data?.customer?.dialogue?.sessionConnection?.sessions || [];
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
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm, pageIndex: 0 }));
  }, 250), []);

  const handleDateChange = useCallback(debounce((startDate: Date | null, endDate: Date | null) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeStartDate: startDate, activeEndDate: endDate, pageIndex: 0 }));
  }, 250), []);

  // TODO: Make this into a custom hook / utility function
  const handleExportCSV = (): void => {
    const csv = Papa.unparse(sessions);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    const currDate = new Date().getTime();

    tempLink.href = csvUrl;
    tempLink.setAttribute('download', `${currDate}-${customerSlug}-${dialogueSlug}.csv`);
    tempLink.click();
    tempLink.remove();
  };

  const { t } = useTranslation();

  const pageCount = data?.customer?.dialogue?.sessionConnection?.pageInfo.nrPages || 1;
  const pageIndex = data?.customer?.dialogue?.sessionConnection?.pageInfo.pageIndex || 0;

  return (
    <InteractionsOverviewContainer>
      <PageTitle>
        <Icon as={Activity} mr={1} />
        {t('views:interactions_view')}
      </PageTitle>
      {/* TODO: Make a ViewTitle text-component */}
      <InputOutputContainer mb={4}>
        <OutputContainer>
          {/* TODO: Make a button component out of this */}
          <Button
            onClick={handleExportCSV}
            leftIcon={Download}
            size="sm"
          >
            <Span fontWeight="bold">Export to CSV</Span>
          </Button>
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
      <Div borderRadius="lg" flexGrow={1} backgroundColor="white" mb="1%">
        <InteractionsTable
          loading={loading}
          headers={HEADERS}
          paginationProps={{ ...paginationProps, pageCount, pageIndex }}
          onPaginationChange={setPaginationProps}
          data={sessions}
          CustomRow={Row}
        />
      </Div>
    </InteractionsOverviewContainer>
  );
};

export default InteractionsOverview;
