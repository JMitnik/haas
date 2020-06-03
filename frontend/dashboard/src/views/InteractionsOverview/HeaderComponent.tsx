import { Div, Grid, H3, Span } from '@haas/ui';
import React from 'react'

interface HeaderColumnProps {
    Header: string;
    accessor: string;
}

interface HeaderComponentProps {
    headers: Array<HeaderColumnProps>;
    sortProperties: {
        id: string;
        desc: boolean;
    }[];
    onGridPropertiesChange: React.Dispatch<React.SetStateAction<TableProps>>;
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

interface HeaderColumnComponentProps {
    value: string;
    accessor: string;
    sortProperties: {
        id: string;
        desc: boolean;
    }[];
    onGridPropertiesChange: React.Dispatch<React.SetStateAction<TableProps>>;
}
const HeaderColumnComponent = ({ sortProperties, accessor, value, onGridPropertiesChange }: HeaderColumnComponentProps) => {
    const handleSort = () => {
        onGridPropertiesChange((prevValues) => {
            const { sortBy } = prevValues;
            const newOrderBy = sortBy?.[0]?.id === accessor
                ? [{ id: sortBy?.[0]?.id, desc: !sortBy?.[0]?.desc }]
                : [{ id: accessor, desc: true }]
            return { ...prevValues, sortBy: newOrderBy };
        });
    }

    return (
      <Div
        onClick={handleSort}
        useFlex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        borderRadius="10px 0 0 10px"
      >
        <Div display="inline-block" padding="10px">
          <H3 color="#6d767d">
            {value}
          </H3>
        </Div>
        <Span>
          {(sortProperties[0].id === accessor) ? (sortProperties[0].desc ? '🔽' : '🔼') : ''}
        </Span>
      </Div>
    )
}

const HeaderComponent = ({ sortProperties, headers, onGridPropertiesChange }: HeaderComponentProps) => {
    const amtHeaders = headers.length;
    const percentage = 100 / amtHeaders;
    const templateColumns = `${percentage.toString()}% `.repeat(amtHeaders);

    return (
      <Grid
        backgroundColor="#f1f5f8"
        color="black"
        borderRadius="90px"
        gridColumnGap={5}
        gridTemplateColumns={templateColumns}
      >
        { headers && headers.map((header, index) => (
          <HeaderColumnComponent
            sortProperties={sortProperties}
            onGridPropertiesChange={onGridPropertiesChange}
            accessor={header.accessor}
            value={header.Header}
            key={index}
          />
))}
      </Grid>
    )
}

export default HeaderComponent;
