import * as UI from '@haas/ui';
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { Plus } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { DialogueConnection, DialogueConnectionOrder, useDialogueConnectionQuery } from 'types/generated-types';
import { ReactComponent as NoDataIll } from 'assets/images/undraw_no_data.svg';
import { View } from 'layouts/View';
import Searchbar from 'components/SearchBar';
import useAuth from 'hooks/useAuth';

import DialogueCard from './DialogueCard';

const DialogueOverview = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryParams({
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 9),
  });

  const [activeDialogueConnection, setDialogueConnection] = useState<DialogueConnection>();

  const { loading: isLoading } = useDialogueConnectionQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug,
      filter: {
        searchTerm: filter.search,
        offset: filter.pageIndex * filter.perPage,
        perPage: filter.perPage,
        orderBy: {
          by: DialogueConnectionOrder.CreatedAt,
          desc: true,
        },
      },
    },
    errorPolicy: 'ignore',
    notifyOnNetworkStatusChange: true,
    onCompleted: (fetchedData) => {
      setDialogueConnection(fetchedData.customer?.dialogueConnection as DialogueConnection);
    },
  });

  const { canDeleteDialogue } = useAuth();

  const filteredDialogues = activeDialogueConnection?.dialogues || [];
  const pageCount = activeDialogueConnection?.totalPages || 0;

  return (
    <View documentTitle="haas | Dialogues">
      <UI.ViewHead>
        <UI.Flex justifyContent="space-between">
          <UI.Div>
            <UI.Flex alignItems="flex-end" flexWrap="wrap">
              <UI.Div mr={4}>
                <UI.ViewTitle>
                  {t('dialogues')}
                </UI.ViewTitle>
                <UI.ViewSubTitle>
                  {t('dialogues_subtitle')}
                </UI.ViewSubTitle>
              </UI.Div>

              {canDeleteDialogue && (
                <UI.Div>
                  <UI.NavButton
                    leftIcon={Plus}
                    size="sm"
                    to={`/dashboard/b/${customerSlug}/dialogue/add`}
                  >
                    {t('add_dialogue')}
                  </UI.NavButton>
                </UI.Div>
              )}
            </UI.Flex>
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

      <UI.ViewBody>
        <UI.Grid
          gridGap={4}
          gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(350px, 1fr))']}
          gridAutoRows="minmax(200px, 1fr)"
        >
          {filteredDialogues.map((dialogue: any, index: any) => dialogue && (
            <DialogueCard key={index} dialogue={dialogue} />
          ))}
        </UI.Grid>

        {filteredDialogues.length === 0 && (
          <UI.IllustrationCard
            boxShadow="sm"
            svg={<NoDataIll />}
            text={t('no_dialogues_found')}
          >
            <UI.Button variant="outline" onClick={() => setFilter({ pageIndex: 0, search: '' })}>
              {t('clear_filters')}
            </UI.Button>
          </UI.IllustrationCard>
        )}

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

export default DialogueOverview;
