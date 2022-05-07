import * as UI from '@haas/ui';
import { Grid as GridIcon, List, Plus } from 'react-feather';
import { Link, useParams } from 'react-router-dom';
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { DialogueConnection, DialogueConnectionOrder, useDialogueConnectionQuery } from 'types/generated-types';
import { View } from 'layouts/View';
import Searchbar from 'components/SearchBar';
import SurveyIcon from 'components/Icons/SurveyIcon';
import useAuth from 'hooks/useAuth';

import { AddDialogueCard, TranslatedPlus } from './DialogueOverviewStyles';
import DialogueCard from './DialogueCard';

const DialogueOverview = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();
  const [filter, setFilter] = useQueryParams({
    search: StringParam,
    pageIndex: withDefault(NumberParam, 0),
    perPage: withDefault(NumberParam, 10),
  });

  const [activeDialogueConnection, setDialogueConnection] = useState<DialogueConnection>();
  const [useDialogueGridView, setUseDialogueGridView] = useState(true);

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

  const filteredDialogues = activeDialogueConnection?.dialogues;
  const pageCount = activeDialogueConnection?.totalPages || 0;

  return (
    <View documentTitle="haas | Dialogues">
      <UI.ViewHead>
        <UI.Flex alignItems="flex-end">
          <UI.Div>
            <UI.ViewTitle>
              {t('dialogues')}
            </UI.ViewTitle>
            <UI.ViewSubTitle>
              {t('dialogues_subtitle')}
            </UI.ViewSubTitle>
          </UI.Div>

          <UI.Div ml={4}>
            <UI.NavButton
              leftIcon={Plus}
              size="sm"
              to={`/dashboard/b/${customerSlug}/dialogue/add`}
            >
              {t('add_dialogue')}
            </UI.NavButton>
          </UI.Div>
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.Div mb={4} width="100%">
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div mr={4}>
              <Searchbar
                activeSearchTerm={filter.search}
                onSearchTermChange={(newTerm) => {
                  setFilter(
                    (newFilter) => ({ ...newFilter, pageIndex: 0, search: newTerm }),
                  );
                }}
              />
            </UI.Div>
            <UI.Flex alignItems="center">
              <UI.Button
                size="sm"
                mr={2}
                onClick={() => setUseDialogueGridView(true)}
                variantColor={useDialogueGridView ? 'main' : 'gray'}
                leftIcon={GridIcon}
              >
                {t('grid')}
              </UI.Button>
              <UI.Button
                size="sm"
                onClick={() => setUseDialogueGridView(false)}
                variantColor={useDialogueGridView ? 'gray' : 'main'}
                leftIcon={List}
              >
                {t('list')}
              </UI.Button>

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

        {useDialogueGridView ? (
          <UI.Grid
            gridGap={4}
            gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(350px, 1fr))']}
            gridAutoRows="minmax(200px, 1fr)"
          >
            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard key={index} dialogue={dialogue} />
            ))}

            {canDeleteDialogue && (
              <AddDialogueCard data-cy="AddDialogueCard">
                <Link to={`/dashboard/b/${customerSlug}/dialogue/add`} />

                <UI.Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <SurveyIcon />
                  <TranslatedPlus>
                    <Plus strokeWidth="3px" />
                  </TranslatedPlus>
                  <UI.H4 color="default.dark">
                    {t('create_dialogue')}
                  </UI.H4>
                </UI.Flex>
              </AddDialogueCard>
            )}
          </UI.Grid>
        ) : (
          <UI.Grid gridRowGap={2}>
            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard isCompact key={index} dialogue={dialogue} />
            ))}
          </UI.Grid>
        )}
      </UI.ViewBody>
    </View>
  );
};

export default DialogueOverview;
