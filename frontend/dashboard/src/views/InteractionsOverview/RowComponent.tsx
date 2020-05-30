import React, { useState } from 'react';
import { Div, Grid, Hr, H4, H5 } from '@haas/ui';
import { InteractionDetailQuestionEntry } from './InteractionOverviewStyles';

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
        <Grid style={{ height: isExpanded ? '400px' : '50px' }} gridRowGap={0} gridColumnGap={5} gridTemplateColumns={templateColumns} onClick={() => setIsExpanded(!isExpanded)}>
            {
                headers && headers.map(({ accessor, Cell }) => {
                    const result = Object.entries(data).find((property) => property[0] === accessor);
                    if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />
                })
            }
            {
                isExpanded &&
                <Div height={350} useFlex flexDirection='column' style={{ background: '#f0f0f0', gridColumnStart: 1, gridColumnEnd: -1 }}>
                    <Div padding={25}>  {/* Container */}
                        <Div marginBottom={10} useFlex flexDirection='column'> { /* Detail header */}
                            <Div useFlex flexDirection='row'> {/* User data section */}
                                <Div width='51%'>
                                    <H4 color='#999999'>USER DATA</H4>
                                    <H5 color='#c0bcbb'>User information</H5>
                                </Div>
                                <Div width='49%' useFlex>
                                    <Div useFlex flexDirection='column' width='25%'>
                                        <span style={{ fontWeight: 'bold', color: '#999999' }}>OS</span>
                                        <span style={{ color: '#c0bcbb' }}>Android</span>
                                    </Div>
                                    <Div useFlex flexDirection='column'>
                                        <span style={{ fontWeight: 'bold', color: '#999999' }}>Location</span>
                                        <span style={{ color: '#c0bcbb' }}>Noord Holland</span>
                                    </Div>
                                </Div>
                            </Div>
                            <Div> { /* Additional button secion */}

                            </Div>
                        </Div>
                        <Hr style={{ marginBottom: '15px' }} color='#999999' />
                        <Div position='relative' useFlex flexDirection='row'> { /* Detail content */}
                            <Div width='50%'> { /* Dialogue path header */}
                                <H4 color='#999999'>DIALOGUE PATH</H4>
                                <H5 color='#c0bcbb'>Follow the path they followed in their journey</H5>
                            </Div>
                            <InteractionDetailQuestionEntry useFlex flexDirection='column' width='50%'> { /* Detailed data section */}
                                {data.nodeEntries.map((nodeEntry, index) => {
                                    const { id, depth, values } = nodeEntry;
                                    const { textValue, numberValue } = values[0];
                                    return (
                                        <Div marginBottom={20} useFlex flexDirection='column' key={`${id}-${index}`}>
                                            <Div useFlex flexDirection='row'>
                                                <Div zIndex={1} alignSelf='center' padding={8} marginRight='10%' style={{ background: '#f0f0f0', borderRadius: '90px', border: '1px solid #c0bcbb' }}>
                                                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.38071 0.0109483C9.07504 0.0335751 8.68221 0.106356 8.68221 0.1404C8.68221 0.508634 9.12646 1.68673 9.49962 2.30803C10.1056 3.31685 11.2796 4.43255 11.9826 4.66778C11.9983 4.67305 11.9852 4.71955 11.959 4.75141C11.957 4.75387 11.8735 4.70877 11.7734 4.6512C11.4842 4.48489 11.003 4.30623 10.5289 4.18908C8.60283 3.71318 6.57309 4.13443 4.99645 5.33725C4.82218 5.47024 4.54684 5.70319 4.53863 5.72466C4.53155 5.74303 4.78723 6.03393 4.92503 6.16438C6.16333 7.33639 7.95497 7.61103 9.49213 6.86452C9.9123 6.66045 10.2424 6.66364 10.5655 6.87489C11.5136 7.4945 10.8243 9.03735 9.75039 8.69942C4.91727 7.17847 0.244212 11.5325 1.40725 16.4729C1.45639 16.6818 1.45685 16.6807 1.30689 16.7027C0.187128 16.8671 -0.370834 18.1499 0.271691 19.0828C0.812769 19.8684 1.93051 19.9641 2.60296 19.2824C2.70367 19.1803 2.75313 19.1571 2.77759 19.2003C2.85426 19.3358 3.42993 19.8934 3.55484 19.9532L3.6366 19.9923L6.55589 19.9961L9.47526 20L9.71599 19.9484L9.95676 19.8968L10.0365 19.928C10.6781 20.178 11.3944 19.5207 11.2324 18.8306C11.1008 18.2702 10.4276 17.9398 9.94149 18.1971C9.92206 18.2074 9.91282 18.2045 9.90569 18.186C9.89505 18.1581 9.88601 18.1583 9.18008 18.2038C8.67478 18.2364 8.28089 18.2121 8.28089 18.1483C8.28089 18.1224 8.28833 18.1209 8.3664 18.1312C8.53307 18.1533 9.21154 18.1422 9.39558 18.1143C9.93433 18.0327 10.2991 17.8988 10.7874 17.6032C11.1204 17.4016 11.1571 17.3873 11.1709 17.4543C11.1745 17.4719 11.195 17.5727 11.2163 17.6785C11.3848 18.5143 11.8266 19.2892 12.4606 19.8614L12.6131 19.9991L13.1289 19.9995C13.8261 19.9999 14.0234 19.9469 14.2773 19.6912C14.8301 19.1344 14.473 18.1706 13.6916 18.1101C13.5411 18.0985 13.5398 18.0941 13.6312 17.9113C13.9256 17.3225 14.1383 16.6576 14.2408 16.0057C14.2573 15.9011 14.2737 15.8019 14.2774 15.7853C14.2811 15.7681 14.3421 15.7147 14.4188 15.6613C15.6195 14.8262 16.2703 13.3799 16.1114 11.8997C16.0954 11.7506 15.9238 10.8187 15.8724 10.6019C15.7251 9.98028 16.137 9.42794 16.7947 9.36523C17.4509 9.30262 18.0679 8.50115 17.994 7.80763L17.984 7.71405L17.5947 7.22059C17.3806 6.94918 16.9947 6.45962 16.7373 6.13269C16.4798 5.80579 16.209 5.4752 16.1354 5.39808C15.5624 4.79739 14.7047 4.36603 13.8494 4.24836C13.6946 4.22703 13.6986 4.23422 13.6948 3.97276C13.6615 1.66724 11.673 -0.158804 9.38071 0.0109483Z" fill="#898181" />
                                                    </svg>
                                                </Div>
                                                <Div useFlex flexDirection='column'>
                                                    <span style={{ color: '#c0bcbb', fontSize: '0.8rem', fontWeight: 'normal', fontStyle: 'normal' }}>U ASKED</span>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 300 }}>{id}</span>
                                                    <span style={{ color: '#c0bcbb', fontSize: '0.8rem', fontWeight: 300, marginTop: '4%' }}>THEY ANSWERED</span>
                                                    <span style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '0.8rem' }}>{textValue || numberValue || 'N/A'}</span>
                                                </Div>
                                            </Div>


                                        </Div>
                                    )
                                })}
                            </InteractionDetailQuestionEntry>
                        </Div>

                    </Div>

                </Div>
            }
        </Grid>
    )

}

export default RowComponent;
