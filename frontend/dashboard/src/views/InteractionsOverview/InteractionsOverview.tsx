import React, { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import { DownloadCloud, Search, Calendar } from 'react-feather'
import {
  Row,
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from 'react-table'
import {
  Container, Flex, Grid, H2, H3, Muted, Button,
  Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form
} from '@haas/ui';
import getInteractionsQuery from 'queries/getInteractionsQuery'
import { InputOutputContainer, OutputContainer, InputContainer } from './InteractionOverviewStyles';
import Papa from 'papaparse';
import { format, formatDistance, differenceInCalendarDays } from 'date-fns';
import DatePickerComponent from './DatePickerComponent';

interface CellProps {
  value: any;
  columnProps: any;
}

const MyCell = ({ value }: CellProps) => {
  const date = new Date(parseInt(value));
  const currentDate = new Date();
  const dateDifference = differenceInCalendarDays(currentDate, date);
  let formatted;
  if (dateDifference <= 4 || dateDifference > 7) {
    formatted = `${formatDistance(date, currentDate)} ago`;
  } else if (dateDifference > 4 && dateDifference < 7) {
    formatted = format(date, 'EEEE hh:mm a')
  }

  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 'max-content', padding: '4px 24px', borderRadius: '90px', background: '#f1f5f8', color: '#6d767d' }}>
      <span style={{ fontSize: '0.8em', fontWeight: 900 }}>{formatted?.toUpperCase()}</span>
    </div>

  </div>
}

const getBadgeBackgroundColour = (value: number) => {
  if (value >= 70) return { background: '#e2f0c7', color: '#42c355' };
  else if (value > 50 && value < 70) return { background: '#f2dda5', color: '#dd992a' };
  else return { background: '#f5c4c0', color: '#d5372c' };
}

const ScoreCell = ({ value }: CellProps) => {
  const { background, color } = getBadgeBackgroundColour(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 'max-content', border: '1px solid', padding: '10px', borderRadius: '360px', background, color, borderColor: background }}>
        <span style={{ fontSize: '1.2em', fontWeight: 900 }}>{value}</span>
      </div>

    </div>
  )
}

const UserCell = ({ value }: CellProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 'max-content', padding: '4px 24px', borderRadius: '90px', background: '#f1f5f8', color: '#6d767d' }}>
        <span style={{ fontSize: '0.8em', fontWeight: 900 }}>{value}</span>
      </div>

    </div>
  )
}

const CenterCell = ({ value }: CellProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 'max-content' }}>
        <span style={{ fontSize: '1.2em', fontWeight: 900 }}>{value}</span>
      </div>

    </div>
  )
}

const InteractionsOverview = () => {
  const { topicId, customerId } = useParams();
  const [fetchInteractions, { loading, data }] = useLazyQuery(getInteractionsQuery, { fetchPolicy: 'cache-and-network' });

  const activeStartDate = useMemo(() => data?.interactions?.startDate ? new Date(data?.interactions?.startDate) : null, [data?.interactions?.startDate])
  const activeEndDate = useMemo(() => data?.interactions?.endDate ? new Date(data?.interactions?.endDate) : null, [data?.interactions?.endDate])
  const interactions = useMemo(() => data?.interactions?.sessions || [], [data]);
  const columns = useMemo(() => [{
    Header: "NR",
    id: "row",
    accessor: 'index',
    maxWidth: 50,
    Cell: CenterCell
  }, { Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
  { Header: 'PATHS', accessor: 'paths', Cell: CenterCell }, { Header: 'USER', accessor: 'id', Cell: UserCell }, { Header: 'WHEN', accessor: 'createdAt', Cell: MyCell }], []);

  const order = useMemo(() =>
    data?.interactions?.orderBy?.map(({ id, desc }: { id: string, desc: boolean }) => ({ id, desc })) || [], [data]
  )
  const inputPageSize = useMemo(() => data?.interactions?.pageIndex || 0, [data])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    pageOptions,
    pageCount,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      manualSortBy: true,
      manualPagination: true,
      pageCount: data?.interactions?.pages || 1,
      data: interactions,
      initialState: {
        pageIndex: inputPageSize, pageSize: 8, sortBy: order
      },
    },
    useSortBy,
    usePagination
  )

  useEffect(() => {
    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: {
          startDate: activeStartDate,
          endDate: activeEndDate,
          offset: pageIndex * pageSize,
          limit: pageSize, pageIndex,
          orderBy: [{ id: 'id', desc: true }]
        },
      },
    })
  }, [])

  const handlePage = (whichWay: number) => {
    // FIXME: Somehow manages to go to amount of pages + 1 sometimes
    switch (whichWay) {
      case 0:
        gotoPage(0);
        break;
      case 1:
        nextPage();
        break;
      case -1:
        previousPage();
        break;
      default:
        gotoPage(whichWay);
    }

    const offset = whichWay !== 0 ? (pageIndex + whichWay) * pageSize : 0;
    const newPageIndex = whichWay !== 0 ? pageIndex + whichWay : 0;

    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: {
          startDate: activeStartDate,
          endDate: activeEndDate,
          offset,
          limit: pageSize,
          pageIndex: newPageIndex,
          orderBy: order,
        },
      },
    })
  }

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: {
          startDate,
          endDate,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex,
          orderBy: order,
        },
      },
    })
  }

  const handleSort = (targetSort: any) => {
    const newOrderBy = order?.[0]?.id === targetSort.id ?
      [{ id: order?.[0]?.id, desc: !order?.[0]?.desc }] :
      [{ id: targetSort.id, desc: true }]

    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: {
          startDate: activeStartDate,
          endDate: activeEndDate,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex: pageIndex,
          orderBy: newOrderBy,
        },
      },
    })
  }

  const handleExport = () => {
    const csv = Papa.unparse(interactions);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvUrl;
    const currDate = new Date().getTime();
    tempLink.setAttribute('download', `${currDate}-${customerId}-${topicId}.csv`);
    tempLink.click();
    tempLink.remove();
  }

  console.log('Active date: ', activeStartDate);
  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%"> Interactions </H2>
      <InputOutputContainer mb="5%">
        <OutputContainer>
          <Div justifyContent="center" marginRight='15px'>
            <Muted style={{ fontWeight: 'bold'}}>Exports</Muted> 
          </Div>
          <Div padding='8px 36px' style={{ cursor: 'pointer', borderRadius: '90px' }} onClick={handleExport} useFlex flexDirection='row' alignItems='center' backgroundColor='#c4c4c4'>
            <Div style={{ fontWeight: 'bold' }}>CSV</Div>
          </Div>
        </OutputContainer>
        <InputContainer>
          <DatePickerComponent
            activeStartDate={activeStartDate}
            activeEndDate={activeEndDate}
            handleDateChange={handleDateChange} />
          <Div padding={15} style={{ borderRadius: '90px' }} useFlex flexDirection='row' alignItems='center' backgroundColor='#f1f5f8'>
            <Div style={{ color: '#6d767d'}}>SEARCH</Div>
            <Search style={{ color: '#6d767d', marginLeft: '10px'}}/>
          </Div>
        </InputContainer>
      </InputOutputContainer>
      <Div style={{ background: '#fdfbfe' }} mb="1%" height="65%">

        <table {...getTableProps()} style={{ width: '100%', overflowY: "auto", borderCollapse: 'collapse' }}>
          <thead style={{
            borderRadius: '360px',
            background: '#f1f5f8',
            color: 'black',
            fontWeight: 'bold',
          }}>
            {headerGroups.map((headerGroup, index) => (
              <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  return (
                    <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <Div onClick={() => handleSort(column)} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: '10px 0 0 10px' }}>
                        <Div style={{ maxWidth: 'fit-content' }} padding='10px'>
                          <H3 color='#6d767d'>
                            {column.render('Header')}
                          </H3>
                        </Div>
                        <span>
                          {data?.interactions?.orderBy.find(
                            (columnObject: any) => column.id === columnObject.id) ?
                            (data?.interactions?.orderBy.find(
                              (columnObject: any) => column.id === columnObject.id)?.desc ? ' 🔽' : ' 🔼') : ''}
                        </span>
                      </Div>

                    </th>
                  )
                }
                )}
              </tr>
            ))}
          </thead>
          {
            interactions ? <tbody {...getTableBodyProps()}>
              {page.map((row, index: number) => {
                prepareRow(row)
                return (
                  <tr key={index} {...row.getRowProps()}>
                    {row.cells.map((cell, index: number) => {
                      return <td style={{
                        padding: '8px',
                        // border: 'solid 1px gray',
                        // background: 'papayawhip',
                      }} key={index} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody> : <div>LOADING</div>
          }
        </table>


      </Div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button style={{ padding: '5px', margin: '5px' }} onClick={() => handlePage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button style={{ padding: '5px 7.5px', margin: '5px' }} onClick={() => handlePage(-1)} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button style={{ padding: '5px 7.5px', margin: '5px' }} onClick={() => handlePage(1)} disabled={!canNextPage}>
          {'>'}
        </button>
        <button style={{ padding: '5px', margin: '5px' }} onClick={() => handlePage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </Div>
  )
}

export default InteractionsOverview;
