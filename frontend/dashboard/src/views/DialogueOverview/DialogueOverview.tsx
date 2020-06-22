import { ApolloError } from 'apollo-boost';
import { Card, CardBody, ColumnFlex, DeleteButtonContainer, Div, EditButtonContainer, Flex,
  Grid, H2, H3, Label, PageHeading } from '@haas/ui';
import { Edit, Plus, X } from 'react-feather';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { FC } from 'react';

import DashboardLayout from 'layouts/DashboardLayout';
import Searchbar from 'components/Searchbar';

import { AddDialogueCard } from './DialogueOverviewStyles';
import { MenuHeader, MenuItem } from 'components/Menu/Menu';
import { deleteQuestionnaireMutation } from '../../mutations/deleteQuestionnaire';
import Menu from 'components/Menu';
import ShowMoreButton from 'components/ShowMoreButton';
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
        gridAutoRows="minmax(200px, 1fr)"
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
          <Flex alignItems="center" justifyContent="space-between">
            <H3 color="app.onWhite" fontWeight={500}>
              {dialogue.title}
            </H3>
          </Flex>

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
