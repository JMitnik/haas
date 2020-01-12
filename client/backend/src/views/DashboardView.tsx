import React, { FC } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { ChevronRight, Plus } from 'react-feather';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter } from '../components/UI/Cards';
import { Query, Topic } from '../types';
import { H2, H3, H4 } from '../components/UI/Type';
import { Grid, Flex } from '../components/UI/Container';
import Icon from '../components/UI/Icon';
import Label from '../components/UI/Labels';
import { Div } from '../components/UI/Generics';

const GET_TOPICS_QUERY = gql`
    {
        topics {
            title
        }
    }
`;

const DashboardView: FC = () => {
  const { loading, error, data } = useQuery<Query>(GET_TOPICS_QUERY);

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

  const topics = data?.topics;

  return (
    <>
      <H2 color="default.text" fontWeight={400} mb={4}>Recent Topics</H2>

      <Grid
        gridGap={4}
        gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
        gridAutoRows="minmax(200px, 1fr)"
      >
        {topics?.map((topic, index) => <TopicCard key={index} topic={topic} />)}
        <Link to="/topic-builder">
          <Div useFlex bg="default.footer" alignItems="center" justifyContent="center">
            <Plus />
            <H3>
              Add topic
            </H3>
          </Div>
        </Link>
      </Grid>
    </>
  );
};

const TopicCard = ({ topic }: { topic: Topic }) => (
  <Card useFlex flexDirection="column">
    <CardBody flex="100%">
      <Flex alignItems="center" justifyContent="space-between">
        <H3 fontWeight={500}>
          {topic.title}
        </H3>
        <Label brand="warning">
          {/* TODO: Make dynamic */}
          Score: 9.3
        </Label>
      </Flex>
    </CardBody>
    <CardFooter useFlex justifyContent="center" alignItems="center">
      <H4>
        View project
      </H4>
      <Icon pl={1} fontSize={1}>
        <ChevronRight />
      </Icon>
    </CardFooter>
  </Card>
);

export default DashboardView;
