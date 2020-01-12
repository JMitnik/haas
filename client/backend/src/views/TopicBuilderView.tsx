import React from 'react';

import { MessageCircle } from 'react-feather';
import { Container, Flex } from '../components/UI/Container';
import BasicTopicBuilder from './TopicBuilder/BasicTopicBuilder/BasicTopicBuilder';
import Icon from '../components/UI/Icon';
import { H2 } from '../components/UI/Type';

const TopicBuilderView = () => (
  <Container>
    <Flex alignItems="center">
      <Icon>
        <MessageCircle />
      </Icon>
      <H2 py={3} pl={2}> Topic Builder </H2>
    </Flex>

    <BasicTopicBuilder />
  </Container>
);

export default TopicBuilderView;

