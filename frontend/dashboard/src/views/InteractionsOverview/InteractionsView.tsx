import React from 'react';

import { Grid } from '@haas/ui';
import HeaderComponent from 'components/Table/HeaderComponent';

// import HeaderComponent from './HeaderComponent';
import { CenterCell, ScoreCell, UserCell, WhenCell } from './CellComponents/CellComponents';
import RowComponent from './RowComponent/RowComponent';

interface DataGridProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    sortBy: Array<any>;
}

interface TableProps {
    activeStartDate: Date | null;
    activeEndDate: Date | null;
    activeSearchTerm: string;
    pageIndex: number;
    pageSize: number;
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

const HEADERS = [{ Header: 'SCORE', accessor: 'score', Cell: ScoreCell },
{ Header: 'PATHS', accessor: 'paths', Cell: CenterCell }, { Header: 'USER', accessor: 'id', Cell: UserCell }, { Header: 'WHEN', accessor: 'createdAt', Cell: WhenCell }]

const InteractionsView = (
    { interactions, gridProperties, onGridPropertiesChange }: InteractionsViewProps,
) => {
    const handlePage = (newPageIndex: number) => {
        onGridPropertiesChange((prevValues) => ({ ...prevValues, pageIndex: newPageIndex }))
    }

    return (
      <Grid gridRowGap={2}>
        <HeaderComponent sortProperties={gridProperties.sortBy} onGridPropertiesChange={onGridPropertiesChange} headers={HEADERS} />
        {interactions && interactions.map((interaction, index) => <RowComponent headers={HEADERS} data={interaction} key={index} index={index} />)}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            style={{ padding: '5px', margin: '5px' }}
            onClick={() => handlePage(0)}
            disabled={gridProperties.pageIndex === 0}
          >
            {'<<'}
          </button>
          <button
            style={{ padding: '5px 7.5px', margin: '5px' }}
            onClick={() => handlePage(gridProperties.pageIndex - 1)}
            disabled={gridProperties.pageIndex === 0}
          >
            {'<'}
          </button>
          <button
            style={{ padding: '5px 7.5px', margin: '5px' }}
            onClick={() => handlePage(gridProperties.pageIndex + 1)}
            disabled={gridProperties.pageIndex === gridProperties.pageCount - 1}
          >
            {'>'}
          </button>
          <button
            style={{ padding: '5px', margin: '5px' }}
            onClick={() => handlePage(gridProperties.pageCount - 1)}
            disabled={gridProperties.pageIndex === gridProperties.pageCount - 1}
          >
            {'>>'}
          </button>
          <span>
            Page
            {' '}
            <strong>
              {gridProperties.pageIndex + 1}
              {' '}
              of
              {' '}
              {gridProperties.pageCount}
            </strong>
          </span>
        </div>
      </Grid>
    )
}

export default InteractionsView;
