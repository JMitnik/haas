import React, { useState } from 'react';
import { Div, Grid } from '@haas/ui';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const amtCells = headers.length;
    const percentage = 100 / amtCells;
    const templateColumns = `${percentage.toString()}% `.repeat(amtCells);

    return (
        <Grid style={{height: isExpanded ? '100px' : '50px'}} gridRowGap={0} gridColumnGap={5} gridTemplateColumns={templateColumns} onClick={() => setIsExpanded(!isExpanded)}>
            {
                headers && headers.map(({ accessor, Cell }) => {
                    const result = Object.entries(data).find((property) => property[0] === accessor);
                    if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />
                })
            }
            {
                isExpanded && <Div useFlex justifyContent='center' style={{ border: '1px solid', gridColumnStart: 1, gridColumnEnd: -1}}>DETAIL INFO HERE</Div>
            }
        </Grid>
    )

}

export default RowComponent;
