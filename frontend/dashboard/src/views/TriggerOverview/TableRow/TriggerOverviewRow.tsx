import { Edit, X } from 'react-feather';
import React, { useState } from 'react';

import { DeleteButtonContainer, Div, EditButtonContainer, Flex, Grid, H4, H5, Hr, Span } from '@haas/ui';
import { TableRowProps } from 'components/Table/TableTypes';
import { UserCell } from 'components/Table/CellComponents/CellComponents';
import Table from 'components/Table/Table';

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

const RECIPIENT_HEADERS = [
  { Header: 'FIRST NAME', accessor: 'firstName', Cell: UserCell },
  { Header: 'LAST NAME', accessor: 'lastName', Cell: UserCell },
  { Header: 'EMAIL', accessor: 'email', Cell: UserCell },
  { Header: 'PHONE', accessor: 'phone', Cell: UserCell },
];
const UserRow = ({ headers, data, index, onDeleteEntry, onEditEntry }: TableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amtCells = headers.length;
  const percentage = 100 / amtCells;
  const templateColumns = `${percentage.toString()}% `.repeat(amtCells);
  const userId = data.id;

  const [paginationProps] = useState<TableProps>(
    {
      activeStartDate: null,
      activeEndDate: null,
      activeSearchTerm: '',
      pageIndex: 0,
      pageSize: 8,
      sortBy: [{ id: 'id', desc: true }],
    },
  );

  return (
    <Grid
      position="relative"
      gridRowGap={0}
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {headers && headers.map(({ accessor, Cell }) => {
        const result = Object.entries(data).find((property) => property[0] === accessor);
        if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />;
        return null;
      })}
      <EditButtonContainer
        style={{ top: '0px' }}
        onClick={(event) => onEditEntry && onEditEntry(event, userId)}
      >
        <Edit />
      </EditButtonContainer>
      <DeleteButtonContainer
        style={{ top: '0px' }}
        onClick={(event) => onDeleteEntry && onDeleteEntry(event, userId)}
      >
        <X />
      </DeleteButtonContainer>
      {isExpanded && (
        <Div useFlex flexDirection="column" backgroundColor="#f0f0f0" gridColumn="1 / -1">
          <Div padding={25}>
            <Div marginBottom={10} useFlex flexDirection="column">
              <Div useFlex flexDirection="row">
                <Div width="51%">
                  <H4 color="#999999">TRIGGER</H4>
                  <H5 color="#c0bcbb">General information</H5>
                </Div>
              </Div>
              <Div />
            </Div>
            <Hr style={{ marginBottom: '15px' }} color="#999999" />
            <Div useFlex flexDirection="column">
              <Div width="100%" marginBottom="15px">
                <H4 color="#999999">Conditions</H4>
                <H5 color="#c0bcbb" marginBottom={5}>Condition(s) when notification is sent out</H5>
                <Flex flexDirection="row" justifyContent="space-evenly">
                  <Span fontSize="smaller" color="#999999">
                    Type:
                    {' '}
                    {data?.conditions?.[0]?.type}
                  </Span>
                  {data?.conditions?.[0]?.minValue && (
                    <Span fontSize="smaller" color="#999999">
                      Minimal value:
                      {' '}
                      {data?.conditions?.[0]?.minValue / 10}
                    </Span>
                  )}
                  {data?.conditions?.[0]?.maxValue && (
                    <Span fontSize="smaller" color="#999999">
                      Maximal value:
                      {' '}
                      {data?.conditions?.[0]?.maxValue / 10}
                    </Span>
                  )}
                  {data?.conditions?.[0]?.textValue && (
                    <Span fontSize="smaller" color="#999999">
                      Text match:
                      {' '}
                      {data?.conditions?.[0]?.textValue}
                    </Span>
                  )}
                </Flex>

              </Div>
              <Div width="100%" marginBottom="15px">
                <H4 color="#999999">RECIPIENTS</H4>
                <H5 color="#c0bcbb" marginBottom={5}>The recipients who will receive this specific trigger</H5>
                {/* {data.recipients && (
                  <Table
                    onPaginationChange={() => null}
                    paginationProps={{ ...paginationProps, pageCount: 1, pageIndex: 0 }}
                    headers={RECIPIENT_HEADERS}
                    data={data.recipients}
                    hidePagination
                    disableSorting
                  />
                )} */}

              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Grid>
  );
};

export default UserRow;
