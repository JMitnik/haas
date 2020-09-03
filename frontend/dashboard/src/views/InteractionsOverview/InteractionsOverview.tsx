import * as qs from 'qs';
import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';
import { useLocation, useParams } from 'react-router';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';

import { Activity, Download } from 'react-feather';
import { Button, Icon } from '@chakra-ui/core';
import {
  getDialogueSessionConnection as CustomerSessionConnection,
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries as NodeEntry,
} from 'queries/__generated__/getDialogueSessionConnection';
import { Div, Flex, PageTitle, Span } from '@haas/ui';
import { useTranslation } from 'react-i18next';

import { QuestionNodeTypeEnum } from 'types/globalTypes';
import DatePicker from 'components/DatePicker/DatePicker';
import InteractionsTable from 'components/Table/Table';
import SearchBar from 'components/SearchBar/SearchBar';
import getDialogueSessionConnectionQuery from 'queries/getDialogueSessionConnectionQuery';

import { InteractionCTACell, InteractionDateCell,
  InteractionUserCell, ScoreCell } from './InteractionTableCells';
import { InteractionsOverviewContainer } from './InteractionOverviewStyles';

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

const tableHeaders = [
  { Header: 'user', accessor: 'id', Cell: InteractionUserCell },
  { Header: 'date', accessor: 'createdAt', Cell: InteractionDateCell },
  { Header: 'call_to_action', accessor: 'nodeEntries', Cell: InteractionCTACell },
  { Header: 'score', accessor: 'score', Cell: ScoreCell },
];

const InteractionTableValue = ({ entry }: { entry: NodeEntry }) => {
  switch (entry.relatedNode?.type) {
    case QuestionNodeTypeEnum.SLIDER:
      return <Div>{entry.value?.sliderNodeEntry}</Div>;

    case QuestionNodeTypeEnum.CHOICE:
      return <Div>{entry.value?.choiceNodeEntry}</Div>;

    case QuestionNodeTypeEnum.REGISTRATION:
      return <Div>{entry.value?.registrationNodeEntry}</Div>;

    case QuestionNodeTypeEnum.TEXTBOX:
      return <Div>{entry.value?.textboxNodeEntry}</Div>;

    default:
      return (<Div>N/A available</Div>);
  }
};

const InteractionsOverview = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [fetchInteractions, { data, loading }] = useLazyQuery<CustomerSessionConnection>(getDialogueSessionConnectionQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const location = useLocation();

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: qs.parse(location.search, { ignoreQueryPrefix: true })?.search || '',
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

      <Flex mb={4} alignItems="center" justifyContent="space-between">
        <Button
          onClick={handleExportCSV}
          leftIcon={Download}
          size="sm"
        >
          <Span fontWeight="bold">{t('export_to_csv')}</Span>
        </Button>

        <Flex alignItems="center">
          <DatePicker
            activeStartDate={paginationProps.activeStartDate}
            activeEndDate={paginationProps.activeEndDate}
            onDateChange={handleDateChange}
          />
          <SearchBar
            activeSearchTerm={paginationProps.activeSearchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </Flex>
      </Flex>
      <InteractionsTable
        loading={loading}
        headers={tableHeaders}
        paginationProps={{ ...paginationProps, pageCount, pageIndex }}
        onPaginationChange={setPaginationProps}
        data={sessions}
      />
    </InteractionsOverviewContainer>
  );
};

export default InteractionsOverview;
