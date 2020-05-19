import React, { useState, useMemo } from 'react';

import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import { DownloadCloud, Search, Calendar } from 'react-feather'
import {
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

interface InteractionProps {
    sessionId: string;
    paths: number;
    score: number;
    createdAt: string;
}

const InteractionsOverview = () => {
    const { topicId } = useParams();

    const { loading, data } = useQuery(getInteractionsQuery, {
        variables: {
            dialogueId: topicId,
        },
    });

    const interactions = useMemo(() => data?.interactions || [], [data?.interactions]);
    const columns = useMemo(() => [{ Header: 'Score', accessor: 'score' },
    { Header: 'Paths', accessor: 'paths' }, { Header: 'User', accessor: 'sessionId' }, { Header: 'When', accessor: 'createdAt' }], []);

    console.log('columns: ', columns);
    console.log('interactions: ', interactions);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page
    
        // The rest of these things are super handy, too ;)
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
          initialState: { pageIndex: 1 },
        },
        usePagination
      )
    
    if (loading) return null;

    console.log('Data: ', interactions);
    return (
        <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
            <H2 color="#3e3d5a" fontWeight={400} mb="10%"> Interactions </H2>
            <InputOutputContainer mb="5%">
                <OutputContainer>
                    <Div justifyContent="center">Export</Div>
                    <Button marginLeft="10%" padding="5px 12px">
                        <Div marginRight="20%">PDF</Div>
                        <DownloadCloud />
                    </Button>
                </OutputContainer>
                <InputContainer>
                    <Button marginRight="10%" padding="5px 12px">
                        <Div marginRight="20%">ALL</Div>
                        <Calendar />
                    </Button>
                    <Button padding="5px 12px">
                        <Div marginRight="20%">SEARCH</Div>
                        <Search />
                    </Button>
                </InputContainer>
            </InputOutputContainer>
            <Div style={{ border: "1px solid" }} mb="1%" height="70%">
                {
                    interactions && <table {...getTableProps()} style={{ border: 'solid 1px blue', width: '100%', overflowY: "auto" }}>
                        <thead style={{
                            borderBottom: 'solid 3px red',
                            background: 'aliceblue',
                            color: 'black',
                            fontWeight: 'bold',
                        }}>
                            {headerGroups.map((headerGroup, index) => (
                                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th key={index} {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row: any, index: number) => {
                                prepareRow(row)
                                return (
                                    <tr key={index} {...row.getRowProps()}>
                                        {row.cells.map((cell: any, index: number) => {
                                            return <td style={{
                                                padding: '10px',
                                                border: 'solid 1px gray',
                                                background: 'papayawhip',
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
