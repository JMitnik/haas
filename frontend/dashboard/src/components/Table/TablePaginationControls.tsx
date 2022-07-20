import React from 'react';

import * as UI from '@haas/ui';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Flex, Span } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  sortBy: Array<any>;
}

const StyledInput = styled.input`
 ${({ theme }) => css`
    background: none;
    border: 1px solid ${theme.colors.default.darker};
    border-radius: ${theme.borderRadiuses.subtleRounded};
    padding: 5px;
    color: ${theme.colors.primary};
    font-family: monospace;
    width: 30px;
    margin: 10px;

    &:focus {
      transition: all 0.2s ease-in;
      outline-width: 0;
      outline: none;
      border: 1px solid ${theme.colors.default.darkest};
      box-shadow: none;
    }
  `}
  ::-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
    }
    ::-webkit-outer-spin-button{
        -webkit-appearance: none;
        margin: 0;
    }
`;

interface TablePaginationControlsProps {
  paginationProps: PaginationProps;
  onPageChange: (newPageIndex: number) => void;
}

const TablePaginationControls = ({ paginationProps, onPageChange }: TablePaginationControlsProps) => {
  const { t } = useTranslation();

  return (
    <Flex gridRow="-1" alignItems="center" justifyContent="flex-end">
      <Flex marginRight="20px" alignItems="center" justifyContent="center">
        <UI.IconButton
          aria-label="Go back"
          icon={() => <ChevronLeft />}
          size="sm"
          mr={2}
          onClick={() => onPageChange(paginationProps.pageIndex - 1)}
          isDisabled={paginationProps.pageIndex === 0}
        />
        <Span>{t('page')}</Span>
        <div style={{ textAlign: 'center' }}>
          <StyledInput disabled type="number" value={paginationProps.pageIndex + 1} />
        </div>
        <Span>
          of
          {' '}
          {paginationProps.pageCount}
        </Span>
        <UI.IconButton
          size="sm"
          ml={2}
          aria-label="Go forward"
          icon={() => <ChevronRight />}
          onClick={() => onPageChange(paginationProps.pageIndex + 1)}
          isDisabled={paginationProps.pageIndex === paginationProps.pageCount - 1}
        />
      </Flex>
    </Flex>
  );
};

export default TablePaginationControls;
