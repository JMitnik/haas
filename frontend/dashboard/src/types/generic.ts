export interface DataGridProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  orderBy: Array<any>;
  sortBy?: Array<any>;
}

export interface InteractionGridProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  orderBy: Array<any>;
}

export interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
  orderBy: {
    id: string;
    desc: boolean;
  }[]
}
