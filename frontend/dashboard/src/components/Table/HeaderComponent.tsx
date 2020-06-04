import { Grid } from '@haas/ui';
import React from 'react'

import HeaderColumnComponent from './HeaderColumnComponent';

interface HeaderColumnProps {
    Header: string;
    accessor: string;
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

interface HeaderComponentProps {
    headers: Array<HeaderColumnProps>;
    sortProperties: {
        id: string;
        desc: boolean;
    }[];
    onGridPropertiesChange: React.Dispatch<React.SetStateAction<TableProps>>;
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
