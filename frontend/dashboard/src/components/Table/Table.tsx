import * as UI from '@haas/ui';
import { Div, Flex, H4 } from '@haas/ui';
import { Info } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ReactComponent as NoDataIll } from 'assets/images/undraw_no_data.svg';
import PaginationControls from 'components/Table/TablePaginationControls';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';

import { TableContainer } from './TableStyles';
import { TableInputProps } from './TableTypes';

const Table = ({
  loading,
  headers,
  data,
  paginationProps,
  onPaginationChange,
  onAddEntry,
  CustomRow,
  onEditEntry,
  onDeleteEntry,
  permissions,
  hidePagination,
  disableSorting,
  renderExpandedRowContainer,
  renderOptions,
}: TableInputProps) => {
  const { t } = useTranslation();

  const handlePage = (newPageIndex: number) => {
    if (!onPaginationChange) return;

    onPaginationChange((prevValues: any) => ({ ...prevValues, pageIndex: newPageIndex }));
  };

  return (
    <TableContainer>
      <TableHeader
        sortProperties={paginationProps.sortBy}
        onPaginationChange={onPaginationChange}
        headers={headers}
        onAddEntry={onAddEntry}
        disableSorting={disableSorting}
      />

      <Div>
        {data && data.map((dataEntry, index) => (
          CustomRow ? (
            <CustomRow
              headers={headers}
              onEditEntry={onEditEntry}
              onDeleteEntry={onDeleteEntry}
              permissions={permissions}
              data={dataEntry}
              key={index}
              index={index}
            />
          ) : (
            <TableRow
              headers={headers}
              onEditEntry={onEditEntry}
              onDeleteEntry={onDeleteEntry}
              data={dataEntry}
              key={index}
              renderExpandedRow={renderExpandedRowContainer && renderExpandedRowContainer(dataEntry)}
              renderOptions={renderOptions}
              index={index}
            />
          )
        ))}
      </Div>

      {data.length === 0 && loading && (
        <Flex gridRow="2 / -1" gridColumn="1 / -1" justifyContent="center" alignItems="center">
          <Div color="default.darker" marginRight="5px">
            <Info />
          </Div>
          <H4 color="default.darker">Loading data...</H4>
        </Flex>
      )}

      {data.length === 0 && !loading && (
        <UI.IllustrationCard isFlat svg={<NoDataIll />} text={t('no_data')} />
      )}

      {!hidePagination && (
        <PaginationControls
          paginationProps={paginationProps}
          onPageChange={handlePage}
        />
      )}
    </TableContainer>
  );
};

export default Table;
