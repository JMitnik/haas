import React, { FC } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-boost';

import { ChevronRight, Plus } from 'react-feather';
import { H2, H3, H4, Grid, Flex, Icon, Label, Div, Card, CardBody, CardFooter } from '@haas/ui';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Query, Questionnaire } from '../types.d';

import { getQuestionnairesCustomerQuery } from '../queries/getQuestionnairesCustomerQuery';
import { deleteQuestionnaireMutation } from '../mutations/deleteQuestionnaire';

const TopicsView: FC = () => {
  const { customerId } = useParams();
  const history = useHistory();

  const { loading, error, data } = useQuery<Query>(getQuestionnairesCustomerQuery, {
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

  const topics = data?.questionnaires;

  return (
    <>
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
    </>
  );
};

const AddTopicCard = styled(Card)`
  ${({ theme }) => css`
    position: relative;

    &:hover ${Div} {
      transition: all 0.2s ease-in;
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.1);
    }

    ${Div} {
      height: 100%;
      border: 1px solid ${theme.colors.default.light};
      transition: all 0.2s ease-in;
      display: flex;
      align-items: center;
      flex-direciton: column;
      justify-content: center;
      background: ${theme.colors.default.light};
    }

    a {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      text-decoration: none;
    }
  `}
`;

const TopicCard = ({ topic }: { topic: Questionnaire }) => {
  const [deleteTopic, { loading }] = useMutation(deleteQuestionnaireMutation, {
    onCompleted: () => {
      console.log('Succesfully deleted customer !');
    },
    refetchQueries: [{ query: getQuestionnairesCustomerQuery,
      variables: {
        id: topic.customer.id,
      } }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteClickedCustomer = async (topicId: string) => {
    deleteTopic({
      variables: {
        id: topicId,
      },
    });
  };

  return (
    <Card useFlex flexDirection="column">
      <button type="button" onClick={() => deleteClickedCustomer(topic.id)}>Delete</button>
      <CardBody flex="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {topic.title}
          </H3>
          <Label brand="success">
            Score: 9.3
          </Label>
        </Flex>
      </CardBody>
      <CardFooter useFlex justifyContent="center" alignItems="center">
        <H4>
          View topic
        </H4>
        <Icon pl={1} fontSize={1}>
          <ChevronRight />
        </Icon>
      </CardFooter>
    </Card>
  );
};

export default TopicsView;
