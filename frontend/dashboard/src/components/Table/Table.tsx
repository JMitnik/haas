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
            <UI.Skeleton isLoading={loading || false}>
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
            </UI.Skeleton>
          )
        ))}
      </Div>

      {data.length === 0 && loading && (
        <>
          {[...Array(10).keys()].map((item) => (
            <UI.Skeleton key={item} isLoading manualHeight={40} />
          ))}
        </>
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
