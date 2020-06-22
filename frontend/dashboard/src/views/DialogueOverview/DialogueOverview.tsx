import { ApolloError } from 'apollo-boost';
import { Card, CardBody, ColumnFlex, Div, Flex,
  Grid, H3, PageHeading, Paragraph, Span } from '@haas/ui';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Plus } from 'react-feather';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';

import { MenuHeader, MenuItem } from 'components/Menu/Menu';
import DashboardLayout from 'layouts/DashboardLayout';
import Menu from 'components/Menu';
import Searchbar from 'components/Searchbar';
import ShowMoreButton from 'components/ShowMoreButton';

import { AddDialogueCard } from './DialogueOverviewStyles';
import { deleteQuestionnaireMutation } from '../../mutations/deleteQuestionnaire';
import getQuestionnairesCustomerQuery from '../../queries/getQuestionnairesCustomerQuery';

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
        gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
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

interface DialogueCardOptionsOverlayProps {
  onDelete: () => void;
  onEdit: () => void;
}

const DialogueCardOptionsOverlay = ({ onDelete, onEdit }: DialogueCardOptionsOverlayProps) => (
  <Menu>
    <MenuHeader>Actions</MenuHeader>
    <MenuItem onClick={() => onDelete()}>Delete</MenuItem>
    <MenuItem onClick={() => onEdit()}>Edit</MenuItem>
  </Menu>
);

const DialogueCard = ({ dialogue }: { dialogue: any }) => {
  const history = useHistory();
  const { customerId } = useParams();

  const [deleteTopic] = useMutation(deleteQuestionnaireMutation, {
    refetchQueries: [{
      query: getQuestionnairesCustomerQuery,
      variables: {
        id: customerId,
      },
    }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteDialogue = async (topicId: string) => {
    deleteTopic({
      variables: {
        id: topicId,
      },
    });
  };

  const goToEditDialogue = (topicId: string) => {
    history.push(`/dashboard/c/${customerId}/t/${topicId}/edit`);
  };

  return (
    <Card useFlex flexDirection="column" onClick={() => history.push(`/dashboard/c/${customerId}/t/${dialogue.id}`)}>
      <CardBody flex="100%">
        <ColumnFlex justifyContent="space-between" height="100%">
          <Div>
            <H3 color="app.onWhite" fontWeight={500}>
              {dialogue.title}
            </H3>
            <Paragraph color="app.mutedOnWhite" fontWeight="100">
              haas.live/starbucks/default
            </Paragraph>
          </Div>

          <Flex justifyContent="space-between">
            <Div />
            <ShowMoreButton
              renderMenu={(
                <DialogueCardOptionsOverlay
                  onDelete={() => deleteDialogue(dialogue.id)}
                  onEdit={() => goToEditDialogue(dialogue.id)}
                />
              )}
            />
          </Flex>
        </ColumnFlex>
      </CardBody>
    </Card>
  );
};

export default DialogueOverview;
