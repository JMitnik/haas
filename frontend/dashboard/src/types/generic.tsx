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

export interface BusinessProps {
  name: string;
}

export interface UserProps {
  firstName: string;
  lastName: string;
  business: BusinessProps;
}

export interface DialogueProps {
  id: string;
  title: string;
  publicTitle: string;
}
