import { ApolloError } from 'apollo-boost';
import { Card, CardBody, DeleteButtonContainer, Div, EditButtonContainer, Flex, Grid,
  H2, H3, Label } from '@haas/ui';
import { Edit, Plus, X } from 'react-feather';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { FC } from 'react';

import DashboardLayout from 'layouts/DashboardLayout';

import { AddDialogueCard } from './DialogueOverviewStyles';
import { deleteQuestionnaireMutation } from '../../mutations/deleteQuestionnaire';
import getQuestionnairesCustomerQuery from '../../queries/getQuestionnairesCustomerQuery';

const DialogueOverview: FC = () => {
  const { customerId } = useParams();

  const { loading, error, data } = useQuery<any>(getQuestionnairesCustomerQuery, {
    variables: { id: customerId },
  });

  if (loading) return <p>Loading</p>;

  if (error) {
    return (
      <p>
        Error:
        {' '}
        {error.message}
      </p>
    );
  }

  const dialogues: Array<any> = data?.dialogues;

  return (
    <DashboardLayout>
      <H2 color="default.text" fontWeight={400} mb={4}>Dialogues</H2>

      <Grid
        gridGap={4}
        gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
        gridAutoRows="minmax(200px, 1fr)"
      >
        {dialogues?.map((dialogue, index) => dialogue && <DialogueCard key={index} dialogue={dialogue} />)}

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

  const deleteClickedCustomer = async (event: any, topicId: string) => {
    deleteTopic({
      variables: {
        id: topicId,
      },
    });
    event.stopPropagation();
  };

  const setEditDialogue = (event: any, topicId: string) => {
    history.push(`/dashboard/c/${customerId}/t/${topicId}/edit`);
    event.stopPropagation();
  };

  return (
    <Card useFlex flexDirection="column" onClick={() => history.push(`/dashboard/c/${customerId}/t/${dialogue.id}`)}>
      <CardBody flex="100%">
        <EditButtonContainer onClick={(e) => setEditDialogue(e, dialogue.id)}>
          <Edit />
        </EditButtonContainer>
        <DeleteButtonContainer
          onClick={(e) => deleteClickedCustomer(e, dialogue.id)}
        >
          <X />
        </DeleteButtonContainer>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {dialogue.title}
          </H3>
          <Label brand="success">
            {dialogue.averageScore === 'false' ? 'N/A' : Number(dialogue.averageScore).toFixed(1)}
          </Label>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default DialogueOverview;
