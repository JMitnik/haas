import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import styled, { css } from 'styled-components/macro';

import { CheckBoxWrapper, CheckBox, CheckBoxLabel, GridForm, Button } from '@haas/ui';
import { ButtonProps } from '@haas/ui/src/Buttons';
import InputSectionView from './NameInputForm';
import OpenQuestionForm from './OpenQuestionForm';

export const MiniHeader = styled.h4`
    grid-column-start: 1;
    grid-column-end: 3;
    padding: 10px;
`;

const FullGrid = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
`;

const FullHr = styled.hr`
    grid-column-start: 1;
    grid-column-end: 3;
`;

const QuestionType = styled.div`
    display: flex;
    grid-column-start: 1;
    grid-column-end: 3;

`;

interface QuestionProps {
  questionType: string;
  currentQuestionType: string;
}

const QuestionTypeButton = styled(Button)<ButtonProps & QuestionProps>`
  ${({ theme, questionType, currentQuestionType }) => css`
      background: ${questionType === currentQuestionType ? theme.colors.primary : 'white'};
  `}
`;

const CreateQuestionForm = () => {
  const { handleSubmit } = useForm();
  const [currentQuestionType, setOpenQuestion] = useState('open');
  const onSubmit = (data: any) => { console.log(data); };

  function handleQuestionType(e: any, questionType: string) {
    e.preventDefault();
    setOpenQuestion(questionType);
  }

  return (
    <FullGrid>
      <GridForm onSubmit={handleSubmit(onSubmit)}>
        <InputSectionView full sub_title="" title="" />

        <CheckBoxWrapper>
          <CheckBox id="in_range" type="checkbox" />
          <CheckBoxLabel htmlFor="in_range" />
          <h5>SHOW IF VOTE IN RANGE</h5>
        </CheckBoxWrapper>

        <CheckBoxWrapper>
          <CheckBox id="checkbox" type="checkbox" />
          <CheckBoxLabel htmlFor="checkbox" />
          <h5>JUMP ONLY</h5>
        </CheckBoxWrapper>

        <FullHr />

        <QuestionType>
          <QuestionTypeButton
            currentQuestionType={currentQuestionType}
            questionType="open"
            onClick={(e) => handleQuestionType(e, 'open')}
          >
            OPEN-END ANSWERS
          </QuestionTypeButton>
          <QuestionTypeButton
            currentQuestionType={currentQuestionType}
            questionType="multiple"
            onClick={(e) => handleQuestionType(e, 'multiple')}
          >
            MULTIPLE CHOICE
          </QuestionTypeButton>
        </QuestionType>

        {currentQuestionType === 'open' ? <OpenQuestionForm /> : <div>CLOSE</div>}

      </GridForm>
    </FullGrid>
  );
};

export default CreateQuestionForm;
