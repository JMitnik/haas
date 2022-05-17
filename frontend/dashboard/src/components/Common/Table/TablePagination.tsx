import * as UI from '@haas/ui';
import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { paginate } from 'utils/paginate';
import useDebouncedEffect from 'hooks/useDebouncedEffect';

const PaginationContainer = styled(UI.Div)`
  ${({ theme }) => css`
    box-shadow: ${theme.boxShadows.sm};
    background: ${theme.colors.neutral[100]};
    border: 1px solid ${theme.colors.neutral[400]};
    display: inline-block;
    border-radius: ${theme.borderRadiuses.md}px;
    padding: ${theme.gutter / 3}px ${theme.gutter / 2}px;
  `}
`;

interface PaginationProps {
  pageIndex: number;
  maxPages: number;
  perPage: number;
  setPageIndex: (page: number) => void;
  isLoading: boolean;
}

export const Pagination = ({
  pageIndex,
  maxPages,
  perPage,
  setPageIndex,
  isLoading,
}: PaginationProps) => {
  const { pages } = paginate(maxPages, pageIndex + 1, perPage, 5);
  const startedRef = useRef<boolean>(false);
  const [inputPageIndex, setInputPageIndex] = useState(1);

  useDebouncedEffect(() => {
    if (startedRef.current) {
      startedRef.current = false;
      setPageIndex(Math.max(1, Number(inputPageIndex)));
    }
  }, 500, [inputPageIndex]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = false;
      setInputPageIndex(pageIndex + 1);
    }
  }, [pageIndex, setInputPageIndex]);

  if (pages.length <= 1) return null;

  return (
    <PaginationContainer bg="white">
      <UI.Flex alignItems="center">
        <UI.Div mr={2}>
          <UI.Text color="off.500">
            {pageIndex + 1}
            {' '}
            /
            {' '}
            {maxPages}
          </UI.Text>
        </UI.Div>
        <UI.Input
          type="number"
          value={inputPageIndex}
          width={75}
          height={35}
          // @ts-ignore
          onChange={(e) => { startedRef.current = true; setInputPageIndex(e.target.value); }}
        />
        {pages.length > 1 && (
          <>
            <UI.Stack spacing={2} isInline ml={2}>
              {pages.map((page) => (
                <UI.Button
                  size="sm"
                  isActive={page - 1 === pageIndex}
                  variant="outline"
                  key={page}
                  isDisabled={isLoading}
                  onClick={() => setPageIndex(page)}
                >
                  {page}
                </UI.Button>
              ))}
            </UI.Stack>
          </>
        )}

      </UI.Flex>
    </PaginationContainer>
  );
};
