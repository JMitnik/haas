/* eslint-disable radix */
import * as lodash from 'lodash';
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
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions as Session,
} from 'queries/__generated__/getDialogueSessionConnection';
import { Div, Flex, Hr, PageTitle, Span, Text } from '@haas/ui';
import { useTranslation } from 'react-i18next';

import { QuestionNodeTypeEnum } from 'types/globalTypes';
import DatePicker from 'components/DatePicker/DatePicker';
import MultiChoiceNodeIcon from 'components/Icons/MultiChoiceNodeIcon';
import SearchBar from 'components/SearchBar/SearchBar';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';
import Table from 'components/Table/Table';
import getDialogueSessionConnectionQuery from 'queries/getDialogueSessionConnectionQuery';

import { InteractionDateCell, InteractionPathCell,
  InteractionUserCell, ScoreCell } from './InteractionTableCells';
import { InteractionDetailQuestionEntry, InteractionsOverviewContainer } from './InteractionOverviewStyles';

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
  { Header: 'interaction_path', accessor: 'nodeEntries', Cell: InteractionPathCell },
  { Header: 'score', accessor: 'score', Cell: ScoreCell },
];

const ExpandedInteractionRow = ({ data }: { data: Session }) => {
  const { t } = useTranslation();
  return (
    <Div useFlex flexDirection="column" backgroundColor="gray.100" gridColumn="1 / -1">
      <Div padding={25}>
        <Div marginBottom={10} useFlex flexDirection="column">
          <Div useFlex flexDirection="row">
            <Div width="51%">
              <Text color="gray.400" fontSize="1.2rem" fontWeight="600">{t('interactions:user_data')}</Text>
              <Text color="gray.400" fontWeight="300">{t('interactions:user_information')}</Text>
            </Div>
          </Div>
          <Div />
        </Div>
        <Hr style={{ marginBottom: '15px' }} color="#999999" />
        <Div position="relative" useFlex flexDirection="row">
          <Div width="50%">
            <Text color="gray.400" fontSize="1.2rem" fontWeight="600">{t('interactions:watch_journey_heading')}</Text>
          </Div>
          <InteractionDetailQuestionEntry useFlex flexDirection="column" width="50%">
            {/* TODO: Make each mapped entry an individual component */}
            {data.nodeEntries.map((nodeEntry: any, index: any) => {
              const { id, relatedNode } = nodeEntry;

              return (
                <Div marginBottom={20} useFlex flexDirection="column" key={`${id}-${index}`}>
                  <Div useFlex flexDirection="row">
                    <Div
                      zIndex={1}
                      alignSelf="center"
                      padding={8}
                      marginRight="10%"
                      backgroundColor="gray.100"
                      borderRadius="90px"
                      border="1px solid #c0bcbb"
                    >
                      {relatedNode?.type === 'SLIDER' ? <SliderNodeIcon /> : <MultiChoiceNodeIcon /> }
                    </Div>
                    <Div useFlex flexDirection="column">
                      <Div>
                        <Text fontWeight="300" color="gray.500" fontSize="0.8rem">{t('interactions:you_asked')}</Text>
                        <Text fontWeight="600" color="gray.500" fontSize="0.8rem">{relatedNode?.title || 'N/A'}</Text>
                      </Div>
                      <Div mt={4}>
                        <Text fontWeight="300" color="gray.500" fontSize="0.8rem">{t('interactions:they_answered')}</Text>
                        <Text fontWeight="600" color="gray.500" fontSize="0.8rem">
                          <InteractionTableValue entry={nodeEntry} />
                        </Text>
                      </Div>
                    </Div>
                  </Div>
                </Div>
              );
            })}
          </InteractionDetailQuestionEntry>
        </Div>
      </Div>
    </Div>
  );
};

const InteractionTableValue = ({ entry }: { entry: NodeEntry }) => {
  if (!entry) return <Div>test</Div>;

  switch (entry.relatedNode?.type) {
    case QuestionNodeTypeEnum.SLIDER:
      return <>{entry.value?.sliderNodeEntry}</>;

    case QuestionNodeTypeEnum.CHOICE:
      return <>{entry.value?.choiceNodeEntry}</>;

    case QuestionNodeTypeEnum.REGISTRATION:
      return <>{entry.value?.registrationNodeEntry}</>;

    case QuestionNodeTypeEnum.TEXTBOX:
      return <>{entry.value?.textboxNodeEntry}</>;

    default:
      return (<>N/A available</>);
  }
};

const InteractionsOverview = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [fetchInteractions, { data, loading }] = useLazyQuery<CustomerSessionConnection>(getDialogueSessionConnectionQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const handleExportCSV = (sessions: Array<Session> | undefined, customerSlug: string, dialogueSlug: string) => {
    if (!sessions) return;
    const mappedSessions = sessions.map((session) => {
      const { createdAt, nodeEntries } = session;
      const mappedNodeEntries = nodeEntries.map((entry, index) => {
        const { relatedNode, value } = entry;
        const entryAnswer = value?.choiceNodeEntry
        || value?.linkNodeEntry
        || value?.registrationNodeEntry
        || value?.sliderNodeEntry
        || value?.textboxNodeEntry;
        return { [`depth${index}-title`]: relatedNode?.title, [`depth${index}-entry`]: entryAnswer };
      });
      const mergedNodeEntries = lodash.reduce(mappedNodeEntries, (prev, entry) => ({ ...prev, ...entry }), {});
      const date = new Date(parseInt(createdAt));
      const result = { timestamp: date.toISOString() };
      const mergedResult = lodash.assign(result, mergedNodeEntries);
      return mergedResult;
    });

    const biggestSession = lodash.maxBy(sessions, (session) => session.paths);
    const headers = Array.from(Array(biggestSession?.paths)).map((entry: any, index) => [`depth${index}-title`, `depth${index}-entry`]);
    const flattenedHeader = ['timestamp', ...lodash.flatten(headers)];

    const csv = Papa.unparse(mappedSessions, { columns: flattenedHeader });
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    const currDate = new Date().getTime();

    tempLink.href = csvUrl;
    tempLink.setAttribute('download', `${currDate}-${customerSlug}-${dialogueSlug}.csv`);
    tempLink.click();
    tempLink.remove();
  };

  const [fetchCSVData, { loading: csvLoading }] = useLazyQuery<CustomerSessionConnection>(getDialogueSessionConnectionQuery, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (csvData: any) => {
      const sessions = csvData?.customer?.dialogue?.sessionConnection?.sessions;
      handleExportCSV(sessions, customerSlug, dialogueSlug);
    },
  });

  const location = useLocation();

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: qs.parse(location.search, { ignoreQueryPrefix: true })?.search || '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'createdAt', desc: true }],
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
          onClick={() => fetchCSVData({
            variables: { dialogueSlug, customerSlug },
          })}
          leftIcon={Download}
          isDisabled={csvLoading}
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
      <Table
        loading={loading}
        headers={tableHeaders}
        paginationProps={{ ...paginationProps, pageCount, pageIndex }}
        onPaginationChange={setPaginationProps}
        data={sessions}
        renderExpandedRowContainer={(input) => <ExpandedInteractionRow data={input} />}
      />
    </InteractionsOverviewContainer>
  );
};

export default InteractionsOverview;
