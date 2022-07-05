import * as UI from '@haas/ui';
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { PublicDialogueConnection, useGetDialogueLinksQuery } from 'types/generated-types';
import { View } from 'layouts/View';
import Searchbar from 'components/Common/SearchBar';

import DialogueCard from './DialogueLinkFetchCard';

export const DialogueLinkFetchOverview = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryParams({
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 12),
    workspaceId: StringParam,
  });
  const [activeDialogueConnection, setDialogueConnection] = useState<PublicDialogueConnection>();

  const { loading: isLoading } = useGetDialogueLinksQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      workspaceId: filter.workspaceId || '',
      filter: {
        searchTerm: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
      },
    },
    errorPolicy: 'ignore',
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      setDialogueConnection(fetchedData.dialogueLinks as PublicDialogueConnection);
    },
  });

  const filteredDialogues = activeDialogueConnection?.dialogues;
  const pageCount = activeDialogueConnection?.totalPages || 0;

  const dialogueUnit = 'teams'; // TODO: Make this dependent on the data
  const visitorUnit = 'people'; // TODO: Make this dependent on the data

  return (
    <View documentTitle="haas | Guest dialogues">
      <UI.ViewHead compact>
        <UI.Flex justifyContent="space-between">
          <UI.Div>
            <UI.ViewTitle>
              {t(dialogueUnit)}
            </UI.ViewTitle>
            <UI.ViewSubTitle>
              {t('dialogues_guest_helper', { unit: visitorUnit })}
            </UI.ViewSubTitle>
          </UI.Div>

          <UI.Div>
            <Searchbar
              search={filter.search}
              isLoading={isLoading}
              onSearchChange={(newTerm) => {
                setFilter(
                  (newFilter) => ({ ...newFilter, pageIndex: 0, search: newTerm }),
                );
              }}
            />
          </UI.Div>
        </UI.Flex>

      </UI.ViewHead>

      <UI.ViewBody compact>
        {filteredDialogues?.length === 0 && (
          <UI.Flex justifyContent="center">
            {t('no_dialogues_message')}
          </UI.Flex>
        )}
        <UI.Grid
          gridGap={4}
          gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
          gridAutoRows="minmax(150px, 1fr)"
        >
          {filteredDialogues?.map((dialogue) => dialogue && (
            <DialogueCard
              loading={isLoading}
              key={dialogue.slug}
              dialogue={dialogue}
            />
          ))}
        </UI.Grid>

        <UI.Div mt={4} width="100%">
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div mr={4} />
            <UI.Flex alignItems="center">
              <UI.Div ml={4}>
                {pageCount > 1 && (
                  <Table.Pagination
                    pageIndex={filter.pageIndex}
                    maxPages={pageCount}
                    perPage={filter.perPage}
                    isLoading={isLoading}
                    setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
                  />
                )}
              </UI.Div>
            </UI.Flex>
          </UI.Flex>
        </UI.Div>
      </UI.ViewBody>
    </View>
  );
};
