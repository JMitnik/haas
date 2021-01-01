import * as UI from '@haas/ui';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Div, Span, Text } from '@haas/ui';
import { Icon } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { TableHeaderColumnProps } from './TableTypes';

const TableHeaderColumn = ({
  sortProperties,
  accessor,
  Header,
  onPaginationChange,
  disableSorting,
}: TableHeaderColumnProps) => {
  const { t } = useTranslation();

  const handleSort = () => {
    if (disableSorting || !onPaginationChange) return;

    onPaginationChange((prevValues) => {
      const { sortBy } = prevValues;
      const newOrderBy = sortBy?.[0]?.by === accessor
        ? [{ by: sortBy?.[0]?.by, desc: !sortBy?.[0]?.desc }]
        : [{ by: accessor, desc: true }];
      return { ...prevValues, sortBy: newOrderBy, pageIndex: 0 };
    });
  };

  const isInActiveSort = sortProperties && sortProperties[0].by === accessor && !disableSorting;

  return (
    <Div
      onClick={handleSort}
      useFlex
      flexDirection="row"
      alignItems="center"
      borderRadius="10px 0 0 10px"
    >
      <Div style={{ cursor: !disableSorting ? 'pointer' : 'auto' }} display="inline-block">
        <UI.Helper style={{color: isInActiveSort ? 'gray.800 !important' : 'gray.400 !important'}} fontSize="1.1rem" fontWeight="600">
          {t(Header)}
        </UI.Helper>
      </Div>

      <Span>
        {(isInActiveSort && sortProperties) ? (sortProperties[0].desc ? (
          <Icon as={ChevronDown} />
        ) : (
          <Icon as={ChevronUp} />
        )) : ''}
      </Span>
    </Div>
  );
};

export default TableHeaderColumn;
