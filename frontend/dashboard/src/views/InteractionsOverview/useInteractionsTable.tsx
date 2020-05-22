import _ from "lodash";
import { useState, useCallback } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import getInteractionsQuery from 'queries/getInteractionsQuery';
interface GridProps {
  pages: number | null;
  page: number;
  startDate: Date | null;
  endDate: Date | null;
  limit: number;
  sorted?: any;
  offset: number
}

export default function useInteractionsTable() {

  const DEFAULT_PAGE_SIZE = 8;
  const [gridState, setGridState] = useState<GridProps>({ pages: null, page: 1, limit: DEFAULT_PAGE_SIZE, offset: 0, startDate: null, endDate: null });
  const { pages, page, sorted, startDate, endDate, offset, limit, } = gridState;
  const { topicId } = useParams();
  const [fetchInteractions, { loading, data, error }] = useLazyQuery(getInteractionsQuery);

  const onFetchData = useCallback(() => {
    fetchInteractions({
      variables: {
        dialogueId: topicId,
        filter: { startDate, endDate, offset, limit },
      },
    })
    //TODO: destructure result data and set grid stat
    setGridState({pages: null, page: page + 1, startDate, endDate, offset: page * limit,limit });
    console.log('GRID state: ', gridState);
  }, []);

  return {
    gridState: {
      defaultPageSize: DEFAULT_PAGE_SIZE,
      data: data?.interactions || [],
      pages: pages || 5, //FIXME: Get actual pages
      filterable: true,
      manual: true,
      onFetchData,
      loading
    },
    startDate,
    endDate,
    error
  };
}
