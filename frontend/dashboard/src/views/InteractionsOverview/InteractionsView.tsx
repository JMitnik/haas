import React, { useState } from 'react';
import { Grid } from '@haas/ui';
import HeaderComponent from './HeaderComponent';
import RowComponent from './RowComponent';
import { format, formatDistance, differenceInCalendarDays } from 'date-fns';
import { QueryLazyOptions } from '@apollo/react-hooks';
import { gridRow } from 'styled-system';
interface CellProps {
    value: any;
    columnProps?: any;
}

const MyCell = ({ value }: CellProps) => {
    const date = new Date(parseInt(value));
    const currentDate = new Date();
    const dateDifference = differenceInCalendarDays(currentDate, date);
    let formatted;
    if (dateDifference <= 4 || dateDifference >= 7) {
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

const HEADERS = [{ Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
{ Header: 'PATHS', accessor: 'paths', Cell: CenterCell }, { Header: 'USER', accessor: 'id', Cell: UserCell }, { Header: 'WHEN', accessor: 'createdAt', Cell: MyCell }]

interface DataGridProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    sortBy: Array<any>;
}

interface TableProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    sortBy: {
      id: string;
      desc: boolean;
    }[]
  }

interface InteractionsViewProps { 
    interactions: Array<any>;
    onGridPropertiesChange: React.Dispatch<React.SetStateAction<TableProps>>;
    gridProperties: DataGridProps;
}

const InteractionsView = (
    { interactions, gridProperties, onGridPropertiesChange }: InteractionsViewProps) => {

    const handlePage = (newPageIndex: number) => {
        onGridPropertiesChange((prevValues) => {
            return { ...prevValues, pageIndex: newPageIndex }
        })
    }

    console.log('Acive grid properties: ', gridProperties);

    return (
        <Grid gridRowGap={2}>
            <HeaderComponent sortProperties={gridProperties.sortBy} onGridPropertiesChange={onGridPropertiesChange} headers={HEADERS} />
            {interactions && interactions.map((interaction, index) => {
                return <RowComponent headers={HEADERS} data={interaction} key={index} index={index} />
            })}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button style={{ padding: '5px', margin: '5px' }}
                    onClick={() => handlePage(0)}
                    disabled={gridProperties.pageIndex === 0}>
                    {'<<'}
                </button>
                <button style={{ padding: '5px 7.5px', margin: '5px' }}
                    onClick={() => handlePage(gridProperties.pageIndex - 1)}
                    disabled={gridProperties.pageIndex === 0}>
                    {'<'}
                </button>
                <button style={{ padding: '5px 7.5px', margin: '5px' }}
                    onClick={() => handlePage(gridProperties.pageIndex + 1)}
                    disabled={gridProperties.pageIndex === gridProperties.pageCount - 1}>
                    {'>'}
                </button>
                <button style={{ padding: '5px', margin: '5px' }}
                    onClick={() => handlePage(gridProperties.pageCount - 1)}
                    disabled={gridProperties.pageIndex === gridProperties.pageCount - 1}>
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {gridProperties.pageIndex + 1} of {gridProperties.pageCount}
                    </strong>{' '}
                </span>
            </div>
        </Grid>
    )
}

export default InteractionsView;
