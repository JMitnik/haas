import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
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
import { InteractionsOverviewContainer, InputOutputContainer, OutputContainer, InputContainer } from './InteractionOverviewStyles';
import Papa from 'papaparse';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { background, borderRadius } from 'styled-system';


interface InteractionProps {
  sessionId: string;
  paths: number;
  score: number;
  createdAt: string;
}

interface CellProps {
  value: any;
  columnProps: any;
}

const MyCell = ({ value }: CellProps) => {
  const date = new Date(parseInt(value));
  const formattedCreatedAt = format(date, 'dd-LLL-yyyy HH:mm:ss.SSS');
  return <div>{formattedCreatedAt}</div>;
}

const getBadgeBackgroundColour = (value: number) => {
  if (value >= 70) return { background: '#e2f0c7', color: '#42c355' };
  else if ( value > 50 && value < 70) return { background: '#f2dda5', color: '#dd992a' };
  else return { background: '#f5c4c0', color: '#d5372c' };
}

const ScoreCell = ({ value }: CellProps) => {
  const { background, color } = getBadgeBackgroundColour(value);
  return (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{width: 'max-content', border: '1px solid', padding: '10px', borderRadius: '360px', background, color, borderColor: background }}>
    <span style={{fontSize: '1.2em', fontWeight: 900}}>{value}</span>
    </div>
    
  </div>
  )
}


const InteractionsOverview = () => {
  const { topicId, customerId } = useParams();

  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null);
  const [activeEndDate, setActiveEndDate] = useState<Date | null>(null);
  const [activeFocusedInput, setFocusedInput] = useState(null);

  const { loading, data } = useQuery(getInteractionsQuery, {
    variables: {
      dialogueId: topicId,
      filter: { startDate: activeStartDate, endDate: activeEndDate },
    },
  });

  const interactions = useMemo(() => data?.interactions || [], [data?.interactions]);
  const columns = useMemo(() => [{
    Header: "NR",
    id: "row",
    accessor: 'index',
    maxWidth: 50,
  }, { Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
  { Header: 'PATHS', accessor: 'paths' }, { Header: 'USER', accessor: 'sessionId' }, { Header: 'WHEN', accessor: 'createdAt', Cell: MyCell }], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: interactions,
      initialState: {
        pageIndex: 0, pageSize: 8, sortBy: [
          {
            id: 'createdAt',
            desc: true
          }
        ]
      },
    },
    useSortBy,
    usePagination
  )

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


  if (loading) return null;

  return (
    <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
      <H2 color="#3653e8" fontWeight={400} mb="10%"> Interactions </H2>
      <InputOutputContainer mb="5%">
        <OutputContainer>
          <Div justifyContent="center"><Muted>Exports</Muted> </Div>
          <Button marginLeft="10%" padding="2px 8px" onClick={handleExport}>
            <Div marginRight="20%">CSV</Div>
            <DownloadCloud />
          </Button>
        </OutputContainer>
        <InputContainer>
          <DatePicker
            selected={activeStartDate}
            onChange={date => setActiveStartDate(date)}
            selectsStart
            startDate={activeStartDate}
            endDate={activeEndDate}
          />
          <DatePicker
            selected={activeEndDate}
            onChange={date => setActiveEndDate(date)}
            selectsEnd
            startDate={activeStartDate}
            endDate={activeEndDate}
            minDate={activeStartDate}
          />
          <Button padding="5px 12px">
            <Div marginRight="20%">SEARCH</Div>
            <Search />
          </Button>
        </InputContainer>
      </InputOutputContainer>
      <Div style={{ background: '#fdfbfe' }} mb="1%" height="65%">
        {
          interactions && <table {...getTableProps()} style={{ width: '100%', overflowY: "auto", borderCollapse:'collapse' }}>
            <thead style={{
              borderRadius:'360px',
              background: '#f1f5f8',
              color: 'black',
              fontWeight: 'bold',
            }}>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <Div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius:'10px 0 0 10px'}}>
                        <Div width='85%' padding='10px'>
                          <H3 color='#6d767d'>
                            {column.render('Header')}
                          </H3>
                        </Div>
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                        </span>
                      </Div>

                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
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
            </tbody>
          </table>
        }

      </Div>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </Div>
  )
}

export default InteractionsOverview;
