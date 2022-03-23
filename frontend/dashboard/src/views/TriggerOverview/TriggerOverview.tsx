import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import {
  Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/react';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';

import { GenericCell } from 'components/Table/CellComponents/CellComponents';
import SearchBar from 'components/SearchBar/SearchBar';
import ShowMoreButton from 'components/ShowMoreButton';
import Table from 'components/Table/Table';
import deleteTriggerMutation from 'mutations/deleteTrigger';
import getTriggerTableQuery from 'queries/getTriggerTable';
import useAuth from 'hooks/useAuth';

interface TableProps {
  activeStartDate: Date | null;
  activeEndDate: Date | null;
  activeSearchTerm: string;
  pageIndex: number;
  pageSize: number;
  sortBy: {
    by: string;
    desc: boolean;
  }[]
}

const HEADERS = [
  { Header: 'Name', accessor: 'name', Cell: GenericCell },
  { Header: 'Medium', accessor: 'medium', Cell: GenericCell },
  { Header: 'Type', accessor: 'type', Cell: GenericCell },
];

const TriggersOverview = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const toast = useToast();
  const { canEditTriggers, canDeleteTriggers } = useAuth();
  const history = useHistory();
  const [fetchTriggers, { data }] = useLazyQuery(getTriggerTableQuery, { fetchPolicy: 'cache-and-network' });
  const [paginationProps, setPaginationProps] = useState<TableProps>({
    activeStartDate: null,
    activeEndDate: null,
    activeSearchTerm: '',
    pageIndex: 0,
    pageSize: 8,
    sortBy: [{ by: 'name', desc: true }],
  });

  const tableData: any = data?.triggerConnection?.triggers || [];

  useEffect(() => {
    const { activeStartDate, activeEndDate, pageIndex, pageSize, sortBy, activeSearchTerm } = paginationProps;
    fetchTriggers({
      variables: {
        customerSlug,
        filter: {
          startDate: activeStartDate,
          endDate: activeEndDate,
          searchTerm: activeSearchTerm,
          offset: pageIndex * pageSize,
          limit: pageSize,
          pageIndex,
          orderBy: sortBy,
        },
      },
    });
  }, [customerSlug, fetchTriggers, paginationProps]);

  const [deleteTrigger] = useMutation(deleteTriggerMutation, {
    refetchQueries: [{
      query: getTriggerTableQuery,
      variables: {
        customerSlug,
        filter: {
          startDate: paginationProps.activeStartDate,
          endDate: paginationProps.activeEndDate,
          searchTerm: paginationProps.activeSearchTerm,
          offset: paginationProps.pageIndex * paginationProps.pageSize,
          limit: paginationProps.pageSize,
          pageIndex: paginationProps.pageIndex,
          orderBy: paginationProps.sortBy,
        },
      },
    }],
    onError: (serverError: any) => {
      console.log(serverError);
    },
    onCompleted: () => {
      toast({
        title: 'Alert removed!',
        description: 'The alert has been removed from the workspace',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const handleDeleteTrigger = (event: any, entryId: string) => {
    event.stopPropagation();
    deleteTrigger({
      variables: {
        id: entryId,
        customerSlug,
      },
    });
  };

  const handleEditEntry = (event: any, entryId: string) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/triggers/${entryId}/edit`);
  };

  const handleAddUser = (event: any) => {
    event.stopPropagation();
    history.push(`/dashboard/b/${customerSlug}/triggers/add/`);
  };

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setPaginationProps((prevValues) => ({ ...prevValues, activeSearchTerm: newSearchTerm }));
  }, 250), []);

  const pageCount = data?.triggerTable?.totalPages || 1;
  const pageIndex = data?.triggerTable?.pageIndex || 0;

  const { t } = useTranslation();

  return (
    <>
      <UI.ViewHead>
        <UI.Flex justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle>{t('views:trigger_overview')}</UI.ViewTitle>
            <UI.Button
              onClick={handleAddUser}
              lefticon={<Plus />}
              colorScheme="teal"
              size="sm"
              ml={4}
            >
              {t('create_trigger')}
            </UI.Button>
          </UI.Flex>
          <SearchBar
            activeSearchTerm={paginationProps.activeSearchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Div borderRadius="lg" flexGrow={1} backgroundColor="white">
          <Table
            headers={HEADERS}
            paginationProps={{ ...paginationProps, pageCount, pageIndex }}
            onPaginationChange={setPaginationProps}
            onDeleteEntry={handleDeleteTrigger}
            onEditEntry={handleEditEntry}
            onAddEntry={handleAddUser}
            renderOptions={(alertData: any) => (
              <>
                {canDeleteTriggers && (
                  <ShowMoreButton
                    renderMenu={(
                      <UI.List>
                        <UI.ListHeader>{t('edit_trigger')}</UI.ListHeader>
                        {canDeleteTriggers && (
                          <>
                            {canEditTriggers && (
                              <UI.ListItem
                                onClick={(e: any) => handleEditEntry(e, alertData?.id)}
                              >
                                {t('edit_trigger')}
                              </UI.ListItem>
                            )}
                            <Popover>
                              {() => (
                                <>
                                  <PopoverTrigger>
                                    <UI.ListItem>
                                      {t('delete_trigger')}
                                    </UI.ListItem>
                                  </PopoverTrigger>
                                  <PopoverContent zIndex={4}>
                                    <PopoverArrow />
                                    <PopoverHeader>{t('delete')}</PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                      <UI.Text>{t('delete_trigger_popover')}</UI.Text>
                                    </PopoverBody>
                                    <PopoverFooter>
                                      <UI.Button
                                        colorScheme="red"
                                        onClick={(e: any) => handleDeleteTrigger(e, alertData?.id)}
                                      >
                                        {t('delete')}
                                      </UI.Button>
                                    </PopoverFooter>
                                  </PopoverContent>
                                </>
                              )}
                            </Popover>
                          </>
                        )}
                      </UI.List>
                    )}
                  />
                )}
              </>
            )}
            data={tableData}
          />
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};

export default TriggersOverview;
