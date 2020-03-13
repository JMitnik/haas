import React from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';
import { H2, H3, H4, Grid, Flex, Icon, Label, Div, Card, CardBody, CardFooter } from '@haas/ui';
import styled, { css } from 'styled-components';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Query, Questionnaire, Customer } from '../types.d';

import getQuestionnaireData from '../queries/getQuestionnaireData';

const DetailTopicView = () => {
  // Query to get following information: Aggregated value of slider values , All sessions
  const { topicId } = useParams();
  console.log('topic ID: ', topicId);

  const { loading, error, data } = useQuery<Query>(getQuestionnaireData, {
    variables: { topicId },
  });

  console.log('QUESTIONNAIRE DATA: ', data);

  return (
    <>
      <H2 color="default.text" fontWeight={400} mb={4}>__QUESTIONNAIRE_NAME_HERE__</H2>

      <Flex alignItems="center" justifyContent="space-between">
        <div>DIV 1</div>
        <div>DIV 2</div>
      </Flex>
    </>
  );
};

const HistoryLog = styled.div`

`;

export default DetailTopicView;
