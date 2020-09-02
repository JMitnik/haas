import { DataGridProps } from 'types/generic';

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

export interface GenericCellProps {
  value: any;
}

export interface RecipientProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export interface TriggerConditonProps {
  type: string;
  minValue?: number;
  maxValue?: number;
  textValue?: string;
}

export interface CellComponentProps {
  id: string;
  createdAt: string;
  paths: number;
  score: number;
  nodeEntries: Array<NodeEntryProps>;
  conditions: Array<TriggerConditonProps>
  permissions: Array<PermissionProps>;
  recipients: Array<RecipientProps>;
}

export interface PermissionProps {
  name: string;
  id: string;
}

export interface TableInputProps {
  headers: TableHeaderColumnProps[]
  data: Array<any>;
  CustomRow?: any;
  permissions?: Array<any>;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  onDeleteEntry?: (event: any, userId: string) => void;
  onEditEntry?: (event: any, userId: string) => void;
  onAddEntry?: (event: any) => void;
  paginationProps: DataGridProps;
  hidePagination?: boolean;
  disableSorting?: boolean;
  loading?: boolean;
}

export interface TableHeaderColumnProps {
  Header: string;
  accessor: string;
  sortProperties?: {
    by: string;
    desc: boolean;
  }[];
  onPaginationChange?: React.Dispatch<React.SetStateAction<TableProps>>;
  Cell?: React.FC<GenericCellProps>;
  disableSorting?: boolean;
}

export interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
  sortBy: {
    by: string;
    desc: boolean;
  }[]
}

export interface TableHeaderProps {
  headers: Array<TableHeaderColumnProps>;
  sortProperties?: {
    by: string;
    desc: boolean;
  }[];
  onAddEntry?: (event: any) => void;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
  disableSorting?: boolean;
}

export interface TableRowProps {
  data: CellComponentProps;
  permissions?: Array<PermissionProps>;
  headers: Array<TableHeaderColumnProps>;
  index: number;
  onDeleteEntry?: (event: any, userId: string) => void;
  onEditEntry?: (event: any, userId: string) => void;
}

export interface UserRowProps {
  data: CellComponentProps;
  permissions?: Array<PermissionProps>;
  onDeleteEntry?: (event: any, userId: string) => void;
  onEditEntry?: (event: any, userId: string) => void;
  headers: Array<TableHeaderColumnProps>;
  index: number;
}
