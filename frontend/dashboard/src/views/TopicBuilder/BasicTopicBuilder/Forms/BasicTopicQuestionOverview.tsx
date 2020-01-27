import React, { useState } from 'react';

import styled from 'styled-components';
import { ArrowDown, ArrowUp, Square } from 'react-feather';

import { Div, H3 } from '@haas/ui';
import CreateQuestionForm from './CreateQuestionForm';

export const CreateQuestionContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-start: 1;
  grid-column-end: 3;
  border: 1px solid black;
  align-self: center;
`;

interface CreateQuestionFormProps {
  sendOrderOfQuestionsToParent: (idx: number, direction: string) => void;
  question_index: number;
  question_title: string;
}

const BasicTopicQuestionOverview = (
  { question_index, question_title, sendOrderOfQuestionsToParent }: CreateQuestionFormProps,
) => {
  const [isCollapsed, setCollapsed] = useState(true);

  const toggleCollapseHeader = () => setCollapsed(!isCollapsed);
  const moveQuestionDown = () => sendOrderOfQuestionsToParent(question_index, 'down');
  const moveQuestionUp = () => sendOrderOfQuestionsToParent(question_index, 'up');

  return (
    <CreateQuestionContainer>
      <Div useFlex alignItems="center">
        <H3 p={2}>{question_title}</H3>
        <ArrowDown onClick={() => moveQuestionDown()} />
        <ArrowUp onClick={() => moveQuestionUp()} />
        <Square onClick={() => toggleCollapseHeader()} />
      </Div>

      {!isCollapsed && <CreateQuestionForm />}
    </CreateQuestionContainer>
  );
};

export default BasicTopicQuestionOverview;
