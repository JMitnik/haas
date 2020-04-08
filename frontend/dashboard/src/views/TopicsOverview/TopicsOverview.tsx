import React, { FC } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-boost';

import { Plus, X } from 'react-feather';
import { H2, H3, Grid, Flex, Label, Div, Card, CardBody,
  Container, DeleteButtonContainer } from '@haas/ui';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Query, Questionnaire } from '../../types';

import getQuestionnairesCustomerQuery from '../../queries/getQuestionnairesCustomerQuery';
import { deleteQuestionnaireMutation } from '../../mutations/deleteQuestionnaire';
import AddTopicCard from './TopicsOverviewStyle';

const TopicsOverview: FC = () => {
  const { customerId } = useParams();

  const { loading, error, data } = useQuery<Query>(getQuestionnairesCustomerQuery, {
    variables: { id: customerId },
  });

  if (loading) return <p>Loading</p>;

  if (error) {
    return (
      <p>
        `
        Error:
        {error.message}
        `
      </p>
    );
  }

  const topics = data?.questionnaires;

  return (
    <>
      <Container>
        <H2 color="default.text" fontWeight={400} mb={4}>Topics</H2>

        <Grid
          gridGap={4}
          gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
          gridAutoRows="minmax(200px, 1fr)"
        >
          {topics?.map((topic, index) => topic && <TopicCard key={index} topic={topic} />)}

          <AddTopicCard>
            <Link to={`/c/${customerId}/topic-builder`} />
            <Div>
              <Plus />
              <H3>
                Add topic
              </H3>
            </Div>
          </AddTopicCard>
        </Grid>
      </Container>
    </>
  );
};

const TopicCard = ({ topic }: { topic: Questionnaire }) => {
  const history = useHistory();
  const { customerId } = useParams();

  const [deleteTopic] = useMutation(deleteQuestionnaireMutation, {
    refetchQueries: [{
      query: getQuestionnairesCustomerQuery,
      variables: {
        id: topic.customer.id,
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

  return (
    <Card useFlex flexDirection="column" onClick={() => history.push(`/c/${customerId}/t/${topic.id}`)}>
      <CardBody flex="100%">
        <DeleteButtonContainer
          onClick={(e) => deleteClickedCustomer(e, topic.id)}
        >
          <X />
        </DeleteButtonContainer>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {topic.title}
          </H3>
          <Label brand="success">
            9.3
          </Label>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default TopicsOverview;
