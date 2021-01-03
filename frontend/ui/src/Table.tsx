import React from 'react';
import styled, { css } from 'styled-components';

export const Table = styled.table``;
export const TableRow = styled.tr``;


export const TableHeadingContainer = styled.thead``;
export const TableHeadingCell = styled.th``;

export const TableHeading = ({ children }: any) => (
  <TableHeadingContainer>
    <TableRow>{children}</TableRow>
  </TableHeadingContainer>
)

export const TableBody = styled.tbody``;

interface TableCell {
  isNumeric?: boolean;
}

export const TableCell = styled.td<TableCell>`
  ${({ theme, isNumeric }) => css`
    ${isNumeric && css`
      text-align: right;
    `}
  `}
`;
