import React, { useState } from 'react';
import { Div, Grid, Hr } from '@haas/ui';


export interface NodeEntryValueProps {
    numberValue?: number;
    textValue?: string;
    multiValues?: Array<NodeEntryValueProps>;
    id: string;
}

export interface RelatedNodeProps {
    title: string;
}

export interface NodeEntryProps {
    depth: number;
    id: string;
    values: Array<NodeEntryValueProps>;
    relatedNode: RelatedNodeProps;
}

interface GenericCellPropsInterface {
    value: string | number;
}

interface HeaderColumnProps {
    Header: string;
    accessor: string;
    Cell: React.FC<any>; //TODO: Jonathan pls help with adding props to this type
}

interface CellComponentProps {
    id: string;
    createdAt: string;
    paths: number;
    score: number;
    nodeEntries: Array<NodeEntryProps>;
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


    // TODO: Better way of setting height of component i think
    return (
        <Grid style={{ height: isExpanded ? '350px' : '50px' }} gridRowGap={0} gridColumnGap={5} gridTemplateColumns={templateColumns} onClick={() => setIsExpanded(!isExpanded)}>
            {
                headers && headers.map(({ accessor, Cell }) => {
                    const result = Object.entries(data).find((property) => property[0] === accessor);
                    if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />
                })
            }
            {
                isExpanded &&
                <Div height={300} useFlex flexDirection='column' style={{ background: '#f0f0f0', gridColumnStart: 1, gridColumnEnd: -1 }}>
                    <Div padding={25}>  {/* Container */}
                        <Div useFlex flexDirection='column'> { /* Detail header */}
                            <Div> {/* User data section */}

                            </Div>
                            <Div> { /* Additional button secion */}

                            </Div>
                        </Div>
                        <Hr />
                        <Div useFlex flexDirection='row'> { /* Detail content */}
                            <Div> { /* Dialogue path header */}

                            </Div>
                            <Div useFlex flexDirection='column'> { /* Detailed data section */}
                                {data.nodeEntries.map((nodeEntry, index) => {
                                    const { id, depth, values } = nodeEntry;
                                    const { textValue, numberValue } = values[0];
                                    return (
                                        <Div useFlex justifyContent='space-between' key={`${id}-${index}`}>
                                            <Div>ID: {id}</Div>
                                            <Div>Depth: {depth}</Div>
                                            <Div>Value: {textValue || numberValue || 'N/A'}</Div>
                                        </Div>
                                    )
                                })}
                            </Div>
                        </Div>

                    </Div>

                </Div>
            }
        </Grid>
    )

}

export default RowComponent;
