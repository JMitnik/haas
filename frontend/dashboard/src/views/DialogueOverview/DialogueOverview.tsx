import { Div, Flex, Grid, H4, PageHeading } from '@haas/ui';
import { Link, useParams } from 'react-router-dom';
import { Plus } from 'react-feather';
import { useLazyQuery } from '@apollo/react-hooks';
import React from 'react';

import { getQuestionnairesOfCustomer as CustomerData } from 'queries/__generated__/getQuestionnairesOfCustomer';
import Searchbar from 'components/SearchBar';
import SurveyIcon from 'components/Icons/SurveyIcon';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';

import { AddDialogueCard, TranslatedPlus } from './DialogueOverviewStyles';
import { Skeleton } from '@chakra-ui/core';
import DialogueCard from './DialogueCard';

const DialogueOverview = ({ dialogues, isLoading }: { dialogues: any, isLoading: boolean }) => {
  const { customerSlug } = useParams();

  // TODO: Handle the loading
  const [loadCustomerData, { data }] = useLazyQuery<CustomerData>(getDialoguesOfCustomer, {
    variables: {
      customerSlug,
    },
  });

  const filteredDialogues = data?.customer?.dialogues || dialogues;

  return (
    <>
      <PageHeading>Dialogues</PageHeading>

      <Div mb={4}>
        <Grid gridTemplateColumns="300px 1fr">
          {/* todo: Let the search not flicker the entire overview (do it on overview level again?) */}
          <Searchbar
            activeSearchTerm=""
            onSearchTermChange={(newTerm) => {
              loadCustomerData({ variables: { customerSlug, filter: { searchTerm: newTerm } } });
            }}
          />
        </Grid>
      </Div>

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
              Create a dialogue
            </H4>
          </Flex>
        </AddDialogueCard>
      </Grid>
    </>
  );
};

export default DialogueOverview;
