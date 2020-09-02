import React from 'react';

import { Flex, Span } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  sortBy: Array<any>;
}

const Button = styled.button`
  ${({ theme }) => css`
    background: none;
    border: 1px solid ${theme.colors.default.darker};
    border-radius: ${theme.borderRadiuses.subtleRounded};
    color: ${theme.colors.primary};
    padding: 5px 7.5px; 
    margin: 10px;

    &:hover {
      cursor: pointer;
      transition: all 0.2s ease-in;
      outline-width: 0;
      outline: none;
      border: 1px solid ${theme.colors.default.darkest};
    }
  `}
`;

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
      {/* TODO: Make these buttons styled, use flex-properties instead of margin */}
      <Flex marginRight="20px" alignItems="center" justifyContent="center">
        <Button
          onClick={() => onPageChange(paginationProps.pageIndex - 1)}
          disabled={paginationProps.pageIndex === 0}
        >
          {'<'}
        </Button>
        <Span>
          {t('page')}
        </Span>
        <div style={{ textAlign: 'center' }}>
          <StyledInput disabled type="number" value={paginationProps.pageIndex + 1} />
        </div>
        <Span>
          of
          {' '}
          {paginationProps.pageCount}
        </Span>
        <Button
          onClick={() => onPageChange(paginationProps.pageIndex + 1)}
          disabled={paginationProps.pageIndex === paginationProps.pageCount - 1}
        >
          {'>'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default TablePaginationControls;
