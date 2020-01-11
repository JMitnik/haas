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
  question_index: Number;
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
    const title = `Question #${questionNumber.toString()}`
    setQuestions([...questions, { question_title: title, question_index: questionNumber }])

  }

  function getOrderOfQuestionsFromChild(question_index: number, direction: string) {

    console.log(`Current question index: ${question_index}`);
    if (direction == 'down') {
      if (question_index < (questions.length - 1)) {
        console.log(`old questions: ${questions}`)
        const moving_question = questions.splice(question_index, 1)
        questions.splice(question_index + 1, 0, moving_question[0])
        console.dir(questions)
        setQuestions([...questions])
      }
    } else {
      if (question_index > 0) {
        console.log(`old questions: ${questions}`)
        const moving_question = questions.splice(question_index, 1)
        questions.splice(question_index - 1, 0, moving_question[0])
        setQuestions([...questions])
        console.dir(questions)
      }
    }
  }

  return (
    <GridForm onSubmit={handleSubmit(onSubmit)}>
      <MiniHeader>QUESTIONS AND ANSWERS</MiniHeader>
      <InputSectionView full sub_title="TOPIC ALIAS NAME, USED AS IDENTIFIER" title="TOPIC NAME" />
      {questions?.map((question, index) => (
        <CreateQuestionView question_index={index} sendOrderOfQuestionsToParent={getOrderOfQuestionsFromChild} question_title={question.question_title} />
      ))}
      <AddNewQuestionButton onClick={e => handleNewQuestion(e)}>Add new question</AddNewQuestionButton>
    </GridForm>
  );
};

export default QNATopicsForm;
