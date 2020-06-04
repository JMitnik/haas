export interface DataGridProps {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    sortBy: Array<any>;
}

export interface TableProps {
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
