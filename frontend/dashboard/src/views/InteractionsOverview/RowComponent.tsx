import React from 'react';
import { Grid } from '@haas/ui';

interface GenericCellPropsInterface { 
    value: string | number;
}

interface HeaderColumnProps {
    Header: string;
    accessor: string;
    Cell: React.FC<any>; //TODO: Jonathan pls with adding props to this type
}

interface CellComponentProps {
    id: string;
    createdAt: string;
    paths: number;
    score: number;
}

interface RowComponentProps {
    data: CellComponentProps;
    headers: Array<HeaderColumnProps>
    index: number;
}

const RowComponent = ({ headers, data, index }: RowComponentProps) => {
    const amtCells = headers.length;
    const percentage = 100 / amtCells;
    const templateColumns = `${percentage.toString()}% `.repeat(amtCells);

    return (
        <Grid gridColumnGap={5} gridTemplateColumns={templateColumns}>
            {
                headers && headers.map(({ accessor, Cell }) => {
                    const result = Object.entries(data).find((property) => property[0] === accessor);
                    if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />
                })
            }
        </Grid>
    )

}

export default RowComponent;
