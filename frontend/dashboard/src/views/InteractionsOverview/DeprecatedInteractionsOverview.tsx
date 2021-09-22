/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable radix */
import * as UI from '@haas/ui';
import * as lodash from 'lodash';
import * as qs from 'qs';
import { Activity, Download, Link, Monitor, User, Watch } from 'react-feather';
import { Div, Flex, Span, Text, ViewTitle } from '@haas/ui';
import { Icon } from '@chakra-ui/core';
import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/client';
import { useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';

import {
  getDialogueSessionConnection as CustomerSessionConnection,
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions as Session,
} from 'queries/__generated__/getDialogueSessionConnection';
import {
  EntryBreadCrumbContainer,
  NodeTypeIcon,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { NodeEntry, QuestionNodeTypeEnum } from 'types/generated-types';
import DatePicker from 'components/DatePicker/DatePicker';
import SearchBar from 'components/SearchBar/SearchBar';
import Table from 'components/Table/Table';
import getDialogueSessionConnectionQuery from 'queries/getDialogueSessionConnectionQuery';

import { FormNodeEntry } from './FormNodeEntry';
import {
  InteractionDateCell, InteractionPathCell,
  InteractionUserCell, ScoreCell,
} from './InteractionTableCells';
import {
  InteractionDetailQuestionEntry,
} from './InteractionOverviewStyles';

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
  { Header: 'interaction_path', accessor: 'nodeEntries', Cell: InteractionPathCell, disableSorting: true },
  { Header: 'score', accessor: 'score', Cell: ScoreCell },
];

const FallbackNode = () => (
  <UI.Div>
    User kept it empty
  </UI.Div>
);

const InteractionTableValue = ({ entry }: { entry: NodeEntry }) => {
  if (!entry) return <Div>test</Div>;

  switch (entry.relatedNode?.type) {
    case QuestionNodeTypeEnum.Slider:
      return <>{entry.value?.sliderNodeEntry}</>;

    case QuestionNodeTypeEnum.Choice:
      return <>{entry.value?.choiceNodeEntry}</>;

    case QuestionNodeTypeEnum.VideoEmbedded:
      return <>{entry.value?.videoNodeEntry}</>;

    case QuestionNodeTypeEnum.Registration:
      return <>{entry.value?.registrationNodeEntry}</>;

    case QuestionNodeTypeEnum.Textbox:
      return <>{entry.value?.textboxNodeEntry}</>;

    case QuestionNodeTypeEnum.Form:
      if (!entry.value?.formNodeEntry) return <FallbackNode />;
      return (
        <FormNodeEntry nodeEntry={entry.value?.formNodeEntry} />
      );

    default:
      return (<>N/A available</>);
  }
};

const ExpandedInteractionRow = ({ data }: { data: any }) => {
  const { t } = useTranslation();

  return (
    <Div useFlex flexDirection="column" backgroundColor="gray.100" gridColumn="1 / -1">
      <Div padding={25}>
        <Div marginBottom={10} useFlex flexDirection="column">
          <Div useFlex flexDirection="row">
            <Div width="51%">
              <Text color="gray.400" fontSize="1.2rem" fontWeight="600">{t('interactions:user_data')}</Text>
            </Div>
          </Div>
          <UI.Div pt={4}>
            <UI.Stack isInline spacing={4}>
              {data.delivery && (
                <UI.Div>
                  <UI.Helper>{t('delivery_recipient')}</UI.Helper>
                  <UI.Label size="sm" mt={1} variantColor="cyan">
                    <UI.Icon mr={2}><User width="0.8rem" /></UI.Icon>
                    {data.delivery.deliveryRecipientFirstName}
                    {data.delivery.deliveryRecipientLastName}
                  </UI.Label>
                </UI.Div>
              )}
              {data.device && (
                <UI.Div>
                  <UI.Helper mb={1}>{t('device')}</UI.Helper>
                  <UI.Label mt={1} size="sm" variantColor="cyan">
                    <UI.Icon mr={2}><Monitor width="0.8rem" /></UI.Icon>
                    {data.device}
                  </UI.Label>
                </UI.Div>
              )}
              {data.totalTimeInSec && (
                <UI.Div>
                  <UI.Helper mb={1}>{t('duration')}</UI.Helper>
                  <UI.Label mt={1} size="sm" variantColor="cyan">
                    <UI.Icon mr={2}><Watch width="0.8rem" /></UI.Icon>
                    {data.totalTimeInSec}
                    {' '}
                    {t('seconds')}
                  </UI.Label>
                </UI.Div>
              )}
              {data.originUrl && (
                <UI.Div>
                  <UI.Helper>{t('origin_url')}</UI.Helper>
                  <UI.Label size="sm" mt={1} variantColor="cyan">
                    <UI.Icon mr={2}><Link width="0.8rem" /></UI.Icon>
                    {data.originUrl}
                  </UI.Label>
                </UI.Div>
              )}
            </UI.Stack>
          </UI.Div>
        </Div>
        <UI.Hr />
        <Div position="relative" useFlex flexDirection="row">
          <InteractionDetailQuestionEntry useFlex flexDirection="column">
            {/* TODO: Make each mapped entry an individual component */}
            {data.nodeEntries.map((nodeEntry: any, index: any) => {
              const { id, relatedNode, value } = nodeEntry;

              return (
                <Div marginBottom={20} useFlex flexDirection="column" key={`${id}-${index}`}>
                  <Div useFlex flexDirection="row">
                    <EntryBreadCrumbContainer
                      pr={3}
                      zIndex={10 - index}
                      margin={0}
                      height={40}
                      score={relatedNode?.type === 'SLIDER' ? value?.sliderNodeEntry : null}
                    >
                      <NodeTypeIcon node={relatedNode} />
                    </EntryBreadCrumbContainer>
                    <Div maxWidth={[300, 400, 500, 700]} ml={2} useFlex flexDirection="column">
                      <Div>
                        <Text fontWeight="300" color="gray.500" fontSize="0.8rem">{t('interactions:you_asked')}</Text>
                        <Text fontWeight="600" color="gray.500" fontSize="0.8rem">{relatedNode?.title || 'N/A'}</Text>
                      </Div>
                      <Div mt={4}>
                        <Text
                          fontWeight="300"
                          color="gray.500"
                          fontSize="0.8rem"
                        >
                          {t('interactions:they_answered')}
                        </Text>
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

const DeprecatedInteractionsOverview = () => {
  const { dialogueSlug, customerSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const [fetchInteractions, { data, loading }] = useLazyQuery<CustomerSessionConnection>(
    getDialogueSessionConnectionQuery, {
      fetchPolicy: 'cache-and-network',
    },
  );

  const handleExportCSV = (sessions: Array<Session> | undefined, customerSlug: string, dialogueSlug: string) => {
    if (!sessions) return;
    const mappedSessions = sessions.map((session) => {
      const { createdAt, nodeEntries } = session;
      const mappedNodeEntries = nodeEntries.map((entry, index) => {
        const { relatedNode, value } = entry;
        const entryAnswer = value?.choiceNodeEntry
          || value?.linkNodeEntry
          || value?.registrationNodeEntry
          || value?.formNodeEntry
          || value?.sliderNodeEntry
          || value?.textboxNodeEntry;
        return { [`depth${index}-title`]: relatedNode?.title, [`depth${index}-entry`]: entryAnswer };
      });
      const mergedNodeEntries = lodash.reduce(mappedNodeEntries, (prev, entry) => ({ ...prev, ...entry }), { });
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

  const [fetchCSVData, { loading: csvLoading }] = useLazyQuery<CustomerSessionConnection>(
    getDialogueSessionConnectionQuery, {
      fetchPolicy: 'cache-and-network',
      onCompleted: (csvData: any) => {
        const sessions = csvData?.customer?.dialogue?.sessionConnection?.sessions;
        handleExportCSV(sessions, customerSlug, dialogueSlug);
      },
    },
  );

  const location = useLocation();

  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: qs.parse(location.search, { ignoreQueryPrefix: true })?.search?.toString() || '',
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
    setPaginationProps((prevValues) => ({
      ...prevValues,
      activeStartDate: startDate,
      activeEndDate: endDate,
      pageIndex: 0,
    }));
  }, 250), []);

  const { t } = useTranslation();

  const pageCount = data?.customer?.dialogue?.sessionConnection?.pageInfo.nrPages || 1;
  const pageIndex = data?.customer?.dialogue?.sessionConnection?.pageInfo.pageIndex || 0;

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <ViewTitle>
              <Icon as={Activity} mr={1} />
              {t('views:interactions_view')}
            </ViewTitle>

            <UI.Button
              onClick={() => fetchCSVData({
                variables: { dialogueSlug, customerSlug },
              })}
              leftIcon={Download}
              isDisabled={csvLoading}
              size="sm"
              variantColor="teal"
              ml={4}
            >
              <Span fontWeight="bold">{t('export_to_csv')}</Span>
            </UI.Button>
          </UI.Flex>

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
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <Table
          loading={loading}
          headers={tableHeaders}
          paginationProps={{ ...paginationProps, pageCount, pageIndex }}
          onPaginationChange={setPaginationProps}
          data={sessions}
          renderExpandedRowContainer={(input) => <ExpandedInteractionRow data={input} />}
        />
      </UI.ViewBody>
    </>
  );
};

export default DeprecatedInteractionsOverview;