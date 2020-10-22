import { ApolloError } from 'apollo-boost';
import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast } from '@chakra-ui/core';
import { Div, Flex, PageTitle, Text } from '@haas/ui';
import { Edit, Plus, Trash } from 'react-feather';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';

import { GenericCell } from 'components/Table/CellComponents/CellComponents';
import List from 'components/List/List';
import ListItem from 'components/List/ListItem';
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
  const { customerSlug } = useParams();
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
    refetchQueries: [{ query: getTriggerTableQuery,
      variables: { customerSlug,
        filter: {
          startDate: paginationProps.activeStartDate,
          endDate: paginationProps.activeEndDate,
          searchTerm: paginationProps.activeSearchTerm,
          offset: paginationProps.pageIndex * paginationProps.pageSize,
          limit: paginationProps.pageSize,
          pageIndex: paginationProps.pageIndex,
          orderBy: paginationProps.sortBy,
        } } }],
    onError: (serverError: ApolloError) => {
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
    <Div margin="0 auto" height="100vh" maxHeight="100vh">
      <PageTitle>{t('views:trigger_overview')}</PageTitle>

      <Div mb={4} width="100%">
        <Flex justifyContent="space-between">
          <Div mr={4}>
            <Button
              onClick={handleAddUser}
              leftIcon={Plus}
              variantColor="teal"
            >
              {t('create_trigger')}
            </Button>
          </Div>
          <Div>
            <SearchBar
              activeSearchTerm={paginationProps.activeSearchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
          </Div>
        </Flex>
      </Div>

      <Div borderRadius="lg" flexGrow={1} backgroundColor="white">
        <Table
          headers={HEADERS}
          paginationProps={{ ...paginationProps, pageCount, pageIndex }}
          onPaginationChange={setPaginationProps}
          onDeleteEntry={handleDeleteTrigger}
          onEditEntry={handleEditEntry}
          onAddEntry={handleAddUser}
          renderOptions={
            (data: any) => (
              <>
                {canDeleteTriggers && (
                <ShowMoreButton
                  renderMenu={(
                    <List>
                      {canDeleteTriggers && (
                        <>
                          {canEditTriggers && (
                            <ListItem
                              onClick={(e: any) => handleEditEntry(e, data?.id)}
                              renderLeftIcon={<Edit />}
                            >
                              {t('edit_trigger')}
                            </ListItem>
                          )}
                          <Popover>
                            {() => (
                              <>
                                <PopoverTrigger>
                                  <ListItem
                                    renderLeftIcon={<Trash />}
                                  >
                                    {t('delete_trigger')}
                                  </ListItem>
                                </PopoverTrigger>
                                <PopoverContent zIndex={4}>
                                  <PopoverArrow />
                                  <PopoverHeader>{t('delete')}</PopoverHeader>
                                  <PopoverCloseButton />
                                  <PopoverBody>
                                    <Text>{t('delete_trigger_popover')}</Text>
                                  </PopoverBody>
                                  <PopoverFooter>
                                    <Button
                                      variantColor="red"
                                      onClick={(e: any) => handleDeleteTrigger(e, data?.id)}
                                    >
                                      {t('delete')}
                                    </Button>
                                  </PopoverFooter>
                                </PopoverContent>
                              </>
                            )}
                          </Popover>
                        </>
                      )}
                    </List>
                  )}
                />
                )}
              </>
            )
          }
          data={tableData}
        />
      </Div>
    </Div>
  );
};

export default TriggersOverview;
