export interface DataGridProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  sortBy: Array<any>;
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
