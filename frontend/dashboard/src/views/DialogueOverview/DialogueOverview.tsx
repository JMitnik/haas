import { Div, Grid, H3, PageHeading } from '@haas/ui';
import { Link, useParams } from 'react-router-dom';
import { Plus } from 'react-feather';
import React from 'react';

import DashboardLayout from 'layouts/DashboardLayout';
import Searchbar from 'components/Searchbar';

import { AddDialogueCard } from './DialogueOverviewStyles';
import DialogueCard from './DialogueCard';

// TODO: Do something about this
const DialogueOverviewFilters = () => (
  <div>oops</div>
);

const DialogueOverview = ({ dialogues }: { dialogues: any }) => {
  const { customerId } = useParams();

  return (
    <DashboardLayout>
      <PageHeading>Dialogues</PageHeading>

      <Div mb={4}>
        <Grid gridTemplateColumns="300px 1fr">
          <Searchbar />
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
          <Link to={`/dashboard/c/${customerId}/topic-builder`} />

          <Div>
            <Plus />
            <H3>
              Add dialogue
            </H3>
          </Div>
        </AddDialogueCard>
      </Grid>
    </DashboardLayout>
  );
};

export default DialogueOverview;
