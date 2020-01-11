import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { GridForm } from '../components/UI/GridForm';
import { MiniHeader } from './BasicTopicsFormView';
import InputSectionView from './InputSectionView';
import CreateQuestionView from './CreateQuestionView'
const AddNewQuestionButton = styled.button`
    cursor: pointer;
    grid-column-start: 1;
    grid-column-end: 3;
`;



interface IQuestions {
  question_title: string;
}

const QNATopicsForm = () => {
  const ini: Array<IQuestions> = []
  const [questions, setQuestions] = useState(ini)

  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => { console.log(data); };

  function handleNewQuestion(e: any) {
    e.preventDefault();
    console.log('Clicked button')
    const questionNumber = questions.length + 1 
    const title = `Question ${questionNumber.toString()}`
    setQuestions([...questions, {question_title: title}])
    
  }

  return (
    <GridForm onSubmit={handleSubmit(onSubmit)}>
      <MiniHeader>QUESTIONS AND ANSWERS</MiniHeader>
      <InputSectionView full sub_title="TOPIC ALIAS NAME, USED AS IDENTIFIER" title="TOPIC NAME" />
      {questions?.map((question) => (
                      <CreateQuestionView question_title={question.question_title}/>
                    ))}
      <AddNewQuestionButton  onClick={e => handleNewQuestion(e)}>Add new question</AddNewQuestionButton>
    </GridForm>
  );
};

export default QNATopicsForm;
