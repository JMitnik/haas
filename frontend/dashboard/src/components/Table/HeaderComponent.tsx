
import { PlusCircle } from 'react-feather';
import { useHistory, useParams } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components/macro';

import { Div, Grid } from '@haas/ui';

import HeaderColumnComponent from './HeaderColumnComponent';

interface HeaderColumnProps {
  Header: string;
  accessor: string;
}

interface TableProps {
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

interface HeaderComponentProps {
  headers: Array<HeaderColumnProps>;
  sortProperties: {
    id: string;
    desc: boolean;
  }[];
  onAddEntry?: (event: any) => void;
  onPaginationChange: React.Dispatch<React.SetStateAction<TableProps>>;
}

const AddNewUser = styled(Div)`
  position: absolute;
  cursor: pointer;
  top: 17.5px;
  right: 15px;
  color: #6d767d;

  :hover {
    color: #000;
  }
`;

const HeaderComponent = ({ sortProperties, headers, onPaginationChange, onAddEntry }: HeaderComponentProps) => {
  const history = useHistory();
  const { customerId } = useParams<{ customerId: string }>();
  const amtHeaders = headers.length;
  const percentage = 100 / amtHeaders;
  const templateColumns = `${percentage.toString()}% `.repeat(amtHeaders);

  return (
    <Grid
      position="relative"
      backgroundColor="#f1f5f8"
      color="black"
      borderRadius="90px"
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
    >
      { headers && headers.map((header, index) => (
        <HeaderColumnComponent
          sortProperties={sortProperties}
          onPaginationChange={onPaginationChange}
          accessor={header.accessor}
          value={header.Header}
          key={index}
        />
      ))}
      { onAddEntry && (
      <AddNewUser onClick={onAddEntry}>
        <PlusCircle />
      </AddNewUser>
      )}

    </Grid>
  );
};

export default HeaderComponent;
