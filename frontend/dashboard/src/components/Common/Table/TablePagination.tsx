import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { paginate } from 'utils/paginate';
import useDebouncedEffect from 'hooks/useDebouncedEffect';

const PaginationContainer = styled(UI.Div)`
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
  display: inline-block;
  border-radius: 10px;
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
  const { t } = useTranslation();
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

  return (
    <PaginationContainer bg="white" padding={2}>
      <UI.Flex alignItems="center">
        <UI.Div mr={2}>
          {t('page')}
          {' '}
          {pageIndex + 1}
          {' '}
          {t('out_of')}
          {' '}
          {maxPages}
        </UI.Div>
        <UI.Input
          type="number"
          value={inputPageIndex}
          width={40}
          // @ts-ignore
          onChange={(e) => { startedRef.current = true; setInputPageIndex(e.target.value); }}
        />
        {pages.length > 1 && (
          <>
            <UI.Stack spacing={2} isInline ml={2}>
              {pages.map((page) => (
                <UI.Button
                  size="sm"
                  variantColor="teal"
                  isActive={page - 1 === pageIndex}
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
