import { motion } from "framer-motion";
import React from "react";
import styled, { css } from "styled-components";
import { CardBody, Card } from "./Cards";
import { IconCheck } from "./assets/icon-check";

interface TableRowProps {
  hasHover?: boolean;
  isSelected?: boolean;
}


export const ModernTableRow = styled.tr<TableRowProps>`
  ${({ theme, hasHover, isSelected }) => css`
    border-left: 3px solid transparent;
    border-radius: 10px;
    background: white;
    margin-bottom: 24px;

    border-collapse: separate;
    border-spacing: 0 8px;

    ${hasHover &&
    css`
      &:hover {
        cursor: pointer;
        background: ${theme.colors.gray[100]};
      }
    `}

    ${isSelected &&
    css`
      background: blue;
      background: ${theme.colors.gray[200]};

      &:hover {
        background: ${theme.colors.gray[200]};
      }
    `}
  `}
`;

export const TableRow = styled.tr<TableRowProps>`
  ${({ theme, hasHover, isSelected }) => css`
    border-left: 3px solid transparent;

    ${hasHover &&
    css`
      &:hover {
        cursor: pointer;
        background: ${theme.colors.gray[100]};
      }
    `}

    ${isSelected &&
    css`
      background: blue;
      background: ${theme.colors.gray[200]};

      &:hover {
        background: ${theme.colors.gray[200]};
      }
    `}
  `}
`;

export const Table = styled.table<{ isLoading?: boolean }>`
  ${({ theme, isLoading }) => css`
    ${isLoading &&
    css`
      ${TableRow} {
        opacity: 0.8;
      }
    `}

    /* ${TableRow} + ${TableRow} {
      border-top: 1px solid ${theme.colors.gray[200]};
    } */
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
    text-align: left;
  `}
`;

export const TableHeadingCell = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
`;

export const TableHeading = ({ children, ...props }: any) => (
  <TableHeadingContainer {...props}>
    <TableRow>{children}</TableRow>
  </TableHeadingContainer>
);

export const TableBody = styled.tbody``;

interface TableCellProps {
  isNumeric?: boolean;
  center?: boolean;
}

export const TableCell = styled.td<TableCellProps>`
  ${({ isNumeric, center }) => css`
    padding: 0.5rem 1.5rem;

    ${isNumeric &&
    css`
      text-align: right;
    `}

    ${center &&
    css`
      vertical-align: middle;
    `}
  `}
`;

export const TableSelectContainer = styled.button`
  ${({ theme }) => css`
    width: 1rem;
    border: 1px solid ${theme.colors.gray[400]};
    height: 1rem;
    border-radius: 5px;
  `}
`;

interface TableSelectProps {
  children?: React.ReactChildren;
  onClick?: () => void;
  isSelected?: boolean;
}

export const TableSelect = ({
  children,
  onClick,
  isSelected,
}: TableSelectProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.();
    console.log("Clicked!");
  };

  return (
    <TableSelectContainer onClick={handleClick}>
      <>
        {isSelected && <IconCheck />}
        {children}
      </>
    </TableSelectContainer>
  );
};

const TableActionBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

interface TableActionBarProps {
  children?: React.ReactNode;
}

export const TableActionBar = ({ children }: TableActionBarProps) => {
  return (
    <TableActionBarContainer>
      <motion.div animate={{ y: 0 }} initial={{ y: 50 }}>
        <Card bg="white">
          <CardBody>{children}</CardBody>
        </Card>
      </motion.div>
    </TableActionBarContainer>
  );
};

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
