/* eslint-disable @typescript-eslint/no-use-before-define */
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
import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  CompactEntriesPath,
  EntryBreadCrumbContainer,
  NodeTypeIcon,
} from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { NodeEntry, QuestionNodeTypeEnum, Session, SessionFragmentFragment, useGetInteractionsQueryQuery } from 'types/generated-types';
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
  startDate: Date | null;
  endDate: Date | null;
  search: string;
  pageIndex: number;
  perPage: number;
  sortBy: {
    by: string;
    desc: boolean;
  }[];
  totalPages: number;
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

export const InteractionsOverview = () => {
  // TODO: Test
  const [sessions, setSessions] = useState<SessionFragmentFragment[]>(() => []);
  const { dialogueSlug, customerSlug } = useNavigator();
  const location = useLocation();

  const [filter, setFilter] = useState<TableProps>({
    startDate: null,
    endDate: null,
    search: qs.parse(location.search, { ignoreQueryPrefix: true })?.search?.toString() || '',
    pageIndex: 0,
    perPage: 8,
    sortBy: [{ by: 'createdAt', desc: true }],
    totalPages: 0,
  });

  useGetInteractionsQueryQuery({
    variables: {
      customerSlug,
      dialogueSlug,
      sessionsFilter: {
        startDate: filter.startDate?.toISOString(),
        endDate: filter.endDate?.toISOString(),
        search: filter.search,
      },
    },
    onCompleted: (fetchedData) => {
      setSessions(
        fetchedData?.customer?.dialogue?.sessionConnection?.sessions || [],
      );

      setFilter((filterValues) => ({
        ...filterValues,
        totalPages: fetchedData.customer?.dialogue?.sessionConnection?.totalPages || 0,
      }));
    },
  });

  // const [fetchCSVData, { loading: csvLoading }] = useLazyQuery<CustomerSessionConnection>(
  //   getDialogueSessionConnectionQuery, {
  //     fetchPolicy: 'cache-and-network',
  //     onCompleted: (csvData: any) => {
  //       const sessions = csvData?.customer?.dialogue?.sessionConnection?.sessions;
  //       handleExportCSV(sessions, customerSlug, dialogueSlug);
  //     },
  //   },
  // );

  // useEffect(() => {
  //   const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
  //   fetchInteractions({
  //     variables: {
  //       dialogueSlug,
  //       customerSlug,
  //       filter: {
  //         startDate: activeStartDate,
  //         endDate: activeEndDate,
  //         searchTerm: activeSearchTerm,
  //         offset: pageIndex * pageSize,
  //         limit: pageSize,
  //         pageIndex,
  //         orderBy: sortBy,
  //       },
  //     },
  //   });
  // }, [paginationProps, fetchInteractions, dialogueSlug, customerSlug]);

  const handleSearchTermChange = useCallback(debounce((search: string) => {
    setFilter((prevValues) => ({
      ...prevValues,
      search,
      pageIndex: 0,
    }));
  }, 250), []);

  const handleDateChange = useCallback(debounce((startDate: Date | null, endDate: Date | null) => {
    setFilter((prevValues) => ({
      ...prevValues,
      startDate,
      endDate,
      pageIndex: 0,
    }));
  }, 250), []);

  const { t } = useTranslation();

  return (
    <>
      <UI.ViewHead>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <ViewTitle>
              <Icon as={Activity} mr={1} />
              {t('views:interactions_view')}
            </ViewTitle>

            {/* <UI.Button
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
            </UI.Button> */}
          </UI.Flex>

          <Flex alignItems="center">
            <DatePicker
              activeStartDate={filter.startDate}
              activeEndDate={filter.endDate}
              onDateChange={handleDateChange}
            />
            <SearchBar
              activeSearchTerm={filter.search}
              onSearchTermChange={handleSearchTermChange}
            />
          </Flex>
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Div width="100%">
          <TableHeadingRow gridTemplateColumns="30px 1fr 1fr 1fr 1fr">
            <UI.Div />
            <TableHeadingCell>
              User
            </TableHeadingCell>
            <TableHeadingCell>
              Interaction
            </TableHeadingCell>
            <TableHeadingCell>
              Path
            </TableHeadingCell>
            <TableHeadingCell>
              Delivery
            </TableHeadingCell>
          </TableHeadingRow>
          <UI.Div>
            {sessions.map((session) => (
              <TableRow gridTemplateColumns="30px 1fr 1fr 1fr 1fr" key={session.id}>
                <UI.Div />
                <TableCell>
                  {session.score}
                </TableCell>
                <TableCell>
                  {session.createdAt}
                </TableCell>
                <TableCell>
                  <CompactEntriesPath nodeEntries={session.nodeEntries} />
                </TableCell>
                <TableCell>
                  <UI.Label>
                    {session.delivery?.id}
                  </UI.Label>
                </TableCell>
              </TableRow>
            ))}
          </UI.Div>
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};

const TableHeadingRow = styled(UI.Grid)`
  margin-bottom: 6px;
`;

const TableRow = styled(UI.Grid)`
  background: white;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 10px;
`;

const TableHeadingCell = styled(UI.Div)`
  ${({ theme }) => css`
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.gray[500]};
  `}
`;

const TableCell = styled(UI.Div)`
  font-weight: 600;
  line-height: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
