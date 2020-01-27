import React, { FC } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { ChevronRight, Plus } from 'react-feather';
import { H2, H3, H4, Grid, Flex, Icon, Label, Div, Card, CardBody, CardFooter } from '@haas/ui';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Query, Topic } from '../types.d';

export const GetTopicsQuery = gql`
    {
        topics {
            title
        }
    }
`;

const DashboardView: FC = () => {
  const { loading, error, data } = useQuery<Query>(GetTopicsQuery);

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
        {topics?.map((topic, index) => topic && <TopicCard key={index} topic={topic} />)}

        <AddTopicCard>
          <Link to="/topic-builder" />
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

const TopicCard = ({ topic }: { topic: Topic }) => (
  <Card useFlex flexDirection="column">
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
        View project
      </H4>
      <Icon pl={1} fontSize={1}>
        <ChevronRight />
      </Icon>
    </CardFooter>
  </Card>
);

export default DashboardView;
