import { Div, Grid, H3, PageHeading } from '@haas/ui';
import { Link, useParams } from 'react-router-dom';
import { Plus } from 'react-feather';
import React from 'react';

import Searchbar from 'components/SearchBar';

import { AddDialogueCard } from './DialogueOverviewStyles';
import DialogueCard from './DialogueCard';

// TODO: Do something about this
const DialogueOverviewFilters = () => (
  <div>oops</div>
);

const DialogueOverview = ({ dialogues }: { dialogues: any }) => {
  const { customerSlug } = useParams();

  return (
    <>
      <PageHeading>Dialogues</PageHeading>

      <Div mb={4}>
        <Grid gridTemplateColumns="300px 1fr">
          <Searchbar activeSearchTerm="" onSearchTermChange={(newTerm) => (console.log(newTerm))} />
          <DialogueOverviewFilters />
        </Grid>
      </Div>

      <Grid
        gridGap={4}
        gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(250px, 1fr))']}
        gridAutoRows="minmax(300px, 1fr)"
      >
        {dialogues?.map((dialogue: any, index: any) => dialogue && (
          <DialogueCard key={index} dialogue={dialogue} />
        ))}

        <AddDialogueCard>
          <Link to={`/dashboard/b/${customerSlug}/d/add`} />

          <Div>
            <Plus />
            <H3>
              Add dialogue
            </H3>
          </Div>
        </AddDialogueCard>
      </Grid>
    </>
  );
};

export default DialogueOverview;
