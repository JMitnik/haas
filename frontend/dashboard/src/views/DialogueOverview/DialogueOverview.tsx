import { Button, ButtonGroup } from '@chakra-ui/core';
import { Div, Flex, Grid, H4, PageTitle } from '@haas/ui';
import { Grid as GridIcon, List, Plus } from 'react-feather';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { getQuestionnairesOfCustomer as CustomerData } from 'queries/__generated__/getQuestionnairesOfCustomer';
import Searchbar from 'components/SearchBar';
import SurveyIcon from 'components/Icons/SurveyIcon';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';

import { AddDialogueCard, TranslatedPlus } from './DialogueOverviewStyles';
import DialogueCard from './DialogueCard';

const DialogueOverview = ({ dialogues }: { dialogues: any, isLoading: boolean }) => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();

  const [useDialogueGridView, setUseDialogueGridView] = useState(true);

  // TODO: Handle the loading
  const [loadCustomerData, { data, loading: isSearching }] = useLazyQuery<CustomerData>(getDialoguesOfCustomer, {
    variables: {
      customerSlug,
    },
  });

  const filteredDialogues = data?.customer?.dialogues || dialogues;

  return (
    <>
      <PageTitle>{t('dialogues')}</PageTitle>

      <Div mb={4} maxWidth="800px" width="100%">
        <Flex>
          <Div mr={4}>
            <Searchbar
              activeSearchTerm=""
              onSearchTermChange={(newTerm) => {
                loadCustomerData({ variables: { customerSlug, filter: { searchTerm: newTerm } } });
              }}
              isSearching={isSearching}
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
        </Grid>
      ) : (
          <Grid gridRowGap={2}>
            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard isCompact key={index} dialogue={dialogue} />
            ))}
          </Grid>
        )}
    </>
  );
};

export default DialogueOverview;
