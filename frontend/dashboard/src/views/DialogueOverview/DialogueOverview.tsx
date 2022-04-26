import * as UI from '@haas/ui';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { Div, Flex, Grid, H4, ViewTitle } from '@haas/ui';
import { Grid as GridIcon, List, Plus } from 'react-feather';
import { Link, useParams } from 'react-router-dom';
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Table from 'components/Common/Table';
import { DialogueConnection, DialogueConnectionOrder, useDialogueConnectionQuery } from 'types/generated-types';
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
    <>
      <UI.ViewHead>
        <UI.ViewTitle>
          <ViewTitle>{t('dialogues')}</ViewTitle>
        </UI.ViewTitle>
      </UI.ViewHead>
      <UI.ViewBody>

        <Div mb={4} maxWidth="800px" width="100%">
          <Flex>
            <Div mr={4}>
              <Searchbar
                activeSearchTerm={filter.search}
                onSearchTermChange={(newTerm) => {
                  setFilter(
                    (newFilter) => ({ ...newFilter, pageIndex: 0, search: newTerm }),
                  );
                }}
              />
            </Div>
            <ButtonGroup display="flex" alignItems="center">
              <Button
                size="sm"
                onClick={() => setUseDialogueGridView(true)}
                variantColor={useDialogueGridView ? 'blue' : 'gray'}
                leftIcon={GridIcon}
              >
                {t('grid')}
              </Button>
              <Button
                size="sm"
                onClick={() => setUseDialogueGridView(false)}
                variantColor={useDialogueGridView ? 'gray' : 'blue'}
                leftIcon={List}
              >
                {t('list')}
              </Button>
            </ButtonGroup>
            <UI.Flex justifyContent="flex-end" ml={4}>
              {pageCount > 1 && (
                <Table.Pagination
                  pageIndex={filter.pageIndex}
                  maxPages={pageCount}
                  perPage={filter.perPage}
                  isLoading={isLoading}
                  setPageIndex={(page) => setFilter((newFilter) => ({ ...newFilter, pageIndex: page - 1 }))}
                />
              )}
            </UI.Flex>
          </Flex>
        </Div>

        {useDialogueGridView ? (
          <Grid
            gridGap={4}
            gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(250px, 1fr))']}
            gridAutoRows="minmax(300px, 1fr)"
          >

            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard key={index} dialogue={dialogue} />
            ))}

            {canDeleteDialogue && (
              <AddDialogueCard data-cy="AddDialogueCard">
                <Link to={`/dashboard/b/${customerSlug}/dialogue/add`} />

                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <SurveyIcon />
                  <TranslatedPlus>
                    <Plus strokeWidth="3px" />
                  </TranslatedPlus>
                  <H4 color="default.dark">
                    {t('create_dialogue')}
                  </H4>
                </Flex>
              </AddDialogueCard>
            )}
          </Grid>
        ) : (
          <Grid gridRowGap={2}>
            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard isCompact key={index} dialogue={dialogue} />
            ))}
          </Grid>
        )}
      </UI.ViewBody>
    </>
  );
};

export default DialogueOverview;
