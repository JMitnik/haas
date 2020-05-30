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
    type: string;
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
        <Grid style={{ width: '99%', height: isExpanded ? '400px' : '50px' }} gridRowGap={0} gridColumnGap={5} gridTemplateColumns={templateColumns} onClick={() => setIsExpanded(!isExpanded)}>
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
                                    const { id, depth, values, relatedNode } = nodeEntry;
                                    console.log('related Node: ', relatedNode);
                                    // const { title, type } = relatedNode;
                                    const { textValue, numberValue } = values[0];
                                    return (
                                        <Div marginBottom={20} useFlex flexDirection='column' key={`${id}-${index}`}>
                                            <Div useFlex flexDirection='row'>
                                                <Div zIndex={1} alignSelf='center' padding={8} marginRight='10%' style={{ background: '#f0f0f0', borderRadius: '90px', border: '1px solid #c0bcbb' }}>
                                                    {
                                                        relatedNode?.type === 'SLIDER' ? (
                                                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.38071 0.0109483C9.07504 0.0335751 8.68221 0.106356 8.68221 0.1404C8.68221 0.508634 9.12646 1.68673 9.49962 2.30803C10.1056 3.31685 11.2796 4.43255 11.9826 4.66778C11.9983 4.67305 11.9852 4.71955 11.959 4.75141C11.957 4.75387 11.8735 4.70877 11.7734 4.6512C11.4842 4.48489 11.003 4.30623 10.5289 4.18908C8.60283 3.71318 6.57309 4.13443 4.99645 5.33725C4.82218 5.47024 4.54684 5.70319 4.53863 5.72466C4.53155 5.74303 4.78723 6.03393 4.92503 6.16438C6.16333 7.33639 7.95497 7.61103 9.49213 6.86452C9.9123 6.66045 10.2424 6.66364 10.5655 6.87489C11.5136 7.4945 10.8243 9.03735 9.75039 8.69942C4.91727 7.17847 0.244212 11.5325 1.40725 16.4729C1.45639 16.6818 1.45685 16.6807 1.30689 16.7027C0.187128 16.8671 -0.370834 18.1499 0.271691 19.0828C0.812769 19.8684 1.93051 19.9641 2.60296 19.2824C2.70367 19.1803 2.75313 19.1571 2.77759 19.2003C2.85426 19.3358 3.42993 19.8934 3.55484 19.9532L3.6366 19.9923L6.55589 19.9961L9.47526 20L9.71599 19.9484L9.95676 19.8968L10.0365 19.928C10.6781 20.178 11.3944 19.5207 11.2324 18.8306C11.1008 18.2702 10.4276 17.9398 9.94149 18.1971C9.92206 18.2074 9.91282 18.2045 9.90569 18.186C9.89505 18.1581 9.88601 18.1583 9.18008 18.2038C8.67478 18.2364 8.28089 18.2121 8.28089 18.1483C8.28089 18.1224 8.28833 18.1209 8.3664 18.1312C8.53307 18.1533 9.21154 18.1422 9.39558 18.1143C9.93433 18.0327 10.2991 17.8988 10.7874 17.6032C11.1204 17.4016 11.1571 17.3873 11.1709 17.4543C11.1745 17.4719 11.195 17.5727 11.2163 17.6785C11.3848 18.5143 11.8266 19.2892 12.4606 19.8614L12.6131 19.9991L13.1289 19.9995C13.8261 19.9999 14.0234 19.9469 14.2773 19.6912C14.8301 19.1344 14.473 18.1706 13.6916 18.1101C13.5411 18.0985 13.5398 18.0941 13.6312 17.9113C13.9256 17.3225 14.1383 16.6576 14.2408 16.0057C14.2573 15.9011 14.2737 15.8019 14.2774 15.7853C14.2811 15.7681 14.3421 15.7147 14.4188 15.6613C15.6195 14.8262 16.2703 13.3799 16.1114 11.8997C16.0954 11.7506 15.9238 10.8187 15.8724 10.6019C15.7251 9.98028 16.137 9.42794 16.7947 9.36523C17.4509 9.30262 18.0679 8.50115 17.994 7.80763L17.984 7.71405L17.5947 7.22059C17.3806 6.94918 16.9947 6.45962 16.7373 6.13269C16.4798 5.80579 16.209 5.4752 16.1354 5.39808C15.5624 4.79739 14.7047 4.36603 13.8494 4.24836C13.6946 4.22703 13.6986 4.23422 13.6948 3.97276C13.6615 1.66724 11.673 -0.158804 9.38071 0.0109483Z" fill="#898181" />
                                                            </svg>) : (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M21.9699 12.7299C21.7199 12.5099 21.4099 12.3299 21.0499 12.1899L19.9999 11.7999C19.9603 10.2354 19.4626 8.71687 18.5686 7.43236C17.6746 6.14786 16.4234 5.15379 14.9701 4.57324C13.5168 3.9927 11.9251 3.85118 10.3921 4.1662C8.85912 4.48123 7.45222 5.23897 6.34559 6.34559C5.23897 7.45222 4.48123 8.85912 4.1662 10.3921C3.85118 11.9251 3.9927 13.5168 4.57324 14.9701C5.15379 16.4234 6.14786 17.6746 7.43236 18.5686C8.71687 19.4626 10.2354 19.9603 11.7999 19.9999L12.1999 21.0599C12.3199 21.4199 12.4999 21.7299 12.7299 21.9799C10.6957 22.1275 8.66498 21.6496 6.91013 20.6102C5.15527 19.5709 3.76018 18.0198 2.91195 16.165C2.06373 14.3102 1.80293 12.2404 2.16454 10.2331C2.52614 8.2259 3.49286 6.37722 4.93504 4.93504C6.37722 3.49286 8.2259 2.52614 10.2331 2.16454C12.2404 1.80293 14.3102 2.06373 16.165 2.91195C18.0198 3.76018 19.5709 5.15527 20.6102 6.91013C21.6496 8.66498 22.1275 10.6957 21.9799 12.7299H21.9699ZM11.0199 17.9199C9.9318 17.7396 8.91446 17.2629 8.07963 16.5422C7.24479 15.8214 6.62477 14.8845 6.28768 13.8344C5.95059 12.7843 5.90948 11.6615 6.16885 10.5895C6.42822 9.51756 6.97805 8.53781 7.75793 7.75793C8.53781 6.97805 9.51756 6.42822 10.5895 6.16885C11.6615 5.90948 12.7843 5.95059 13.8344 6.28768C14.8845 6.62477 15.8214 7.24479 16.5422 8.07963C17.2629 8.91446 17.7396 9.9318 17.9199 11.0199L15.5299 10.1199C15.2362 9.56785 14.8172 9.09236 14.3066 8.73156C13.7959 8.37076 13.2077 8.1347 12.5893 8.04234C11.9709 7.94998 11.3394 8.00388 10.7456 8.19973C10.1518 8.39557 9.61217 8.7279 9.17003 9.17003C8.7279 9.61217 8.39557 10.1518 8.19973 10.7456C8.00388 11.3394 7.94998 11.9709 8.04234 12.5893C8.1347 13.2077 8.37076 13.7959 8.73156 14.3066C9.09236 14.8172 9.56785 15.2362 10.1199 15.5299L11.0199 17.9199Z" fill="#898181" />
                                                                    <path d="M17.9599 16.5399L21.7099 20.2899C21.8982 20.4782 22.004 20.7336 22.004 20.9999C22.004 21.2662 21.8982 21.5216 21.7099 21.7099C21.5216 21.8982 21.2662 22.004 20.9999 22.004C20.7336 22.004 20.4782 21.8982 20.2899 21.7099L16.5399 17.9599L15.9699 20.2399C15.9167 20.4446 15.7999 20.6271 15.6364 20.7612C15.4729 20.8953 15.2711 20.9742 15.06 20.9864C14.8488 20.9986 14.6393 20.9436 14.4614 20.8292C14.2835 20.7149 14.1464 20.547 14.0699 20.3499L11.0699 12.3499C11.0028 12.1708 10.9885 11.9761 11.0286 11.7891C11.0688 11.6021 11.1618 11.4305 11.2965 11.2947C11.4312 11.1589 11.6021 11.0646 11.7888 11.023C11.9755 10.9814 12.1703 10.9942 12.3499 11.0599L20.3499 14.0599C20.5512 14.1331 20.7236 14.269 20.8418 14.4476C20.96 14.6262 21.0178 14.838 21.0066 15.0519C20.9954 15.2658 20.9158 15.4704 20.7796 15.6357C20.6434 15.8009 20.4577 15.9181 20.2499 15.9699L17.9499 16.5399H17.9599Z" fill="#898181" />
                                                                </svg>

                                                            )
                                                    }

                                                </Div>
                                                <Div useFlex flexDirection='column'>
                                                    <span style={{ color: '#c0bcbb', fontSize: '0.8rem', fontWeight: 'normal', fontStyle: 'normal' }}>U ASKED</span>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 300 }}>{relatedNode?.title || 'N/A'}</span>
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
