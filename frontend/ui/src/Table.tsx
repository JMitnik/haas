import React from 'react';
import styled, { css } from 'styled-components';

interface TableRowProps {
  hasHover?: boolean;
}

export const TableRow = styled.tr<TableRowProps>`
  ${({ theme, hasHover }) => css`
    border-left: 3px solid transparent;

    ${hasHover && css`
      &:hover {
        cursor: pointer;
        background: ${theme.colors.gray[100]};
      }
    `}
  `}
`;

export const Table = styled.table`
  ${({ theme }) => css`
    ${TableRow} + ${TableRow} {
      border-top: 1px solid ${theme.colors.gray[200]};
    }
  `}
`;


export const TableHeadingContainer = styled.thead`
  ${({ theme }) => css`
    color: ${theme.colors.gray[600]};
    font-weight: 700;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${theme.colors.gray[200]};
    padding: 0 ${theme.gutter}px;
  `}
`;

export const TableHeadingCell = styled.th`
  padding: 0.75rem 1.5rem;
`;

export const TableHeading = ({ children }: any) => (
  <TableHeadingContainer>
    <TableRow>{children}</TableRow>
  </TableHeadingContainer>
)

export const TableBody = styled.tbody``;

interface TableCellProps {
  isNumeric?: boolean;
}

export const TableCell = styled.td<TableCellProps>`
  ${({ isNumeric }) => css`
    padding: 0.5rem 1.5rem;
    
    ${isNumeric && css`
      text-align: right;
    `}
  `}
`;

export const PaginationFooter = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${theme.colors.gray[700]};
    padding: ${theme.gutter / 2}px;
    border-top: 1px solid ${theme.colors.gray[200]};
  `}
`;