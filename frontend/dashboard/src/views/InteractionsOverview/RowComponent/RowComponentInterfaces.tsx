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

interface GenericCellProps {
    value: string | number;
}

export interface HeaderColumnProps {
    Header: string;
    accessor: string;
    Cell: React.FC<GenericCellProps>;
}

export interface CellComponentProps {
    id: string;
    createdAt: string;
    paths: number;
    score: number;
    nodeEntries: Array<NodeEntryProps>;
}

export interface RowComponentProps {
    data: CellComponentProps;
    headers: Array<HeaderColumnProps>
    index: number;
}