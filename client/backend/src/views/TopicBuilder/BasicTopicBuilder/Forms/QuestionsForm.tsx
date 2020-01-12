import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { MiniHeader } from './BasicTopicsTopicForm';
import NameInputForm from './NameInputForm';
import BasicTopicQuestionOverview from './BasicTopicQuestionOverview';
import Button from '../../../../components/UI/Buttons';
import { GridForm } from '../../../../components/UI/Form';

export interface QuestionProps {
  question_index: number;
  question_title: string;
}

const QuestionsForm = () => {
  const [questions, setQuestions] = useState<Array<QuestionProps>>([]);

  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => { console.log(data); };

  const addQuestion = () => {
    const questionNumber = questions.length + 1 || 0;
    const title = `Question #${questionNumber.toString()}`;

    setQuestions((qs) => [...qs, { question_title: title, question_index: questionNumber }]);
  };

  const getOrderOfQuestionsFromChild = (question_index: number, direction: string) => {
    console.log(`Current question index: ${question_index}`);

    if (direction === 'down') {
      if (question_index < (questions.length - 1)) {
        console.log(`old questions: ${questions}`);
        const moving_question = questions.splice(question_index, 1);
        questions.splice(question_index + 1, 0, moving_question[0]);
        console.dir(questions);
        setQuestions([...questions]);
      }
    } else {
      if (question_index <= 0) {
        return;
      }

      console.log(`old questions: ${questions}`);
      const moving_question = questions.splice(question_index, 1);
      questions.splice(question_index - 1, 0, moving_question[0]);
      setQuestions([...questions]);
      console.dir(questions);
    }
  };

  return (
    <GridForm onSubmit={handleSubmit(onSubmit)}>
      <MiniHeader>Questions</MiniHeader>
      <NameInputForm full sub_title="TOPIC ALIAS NAME, USED AS IDENTIFIER" title="TOPIC NAME" />

      {questions?.map((question, index) => (
        <BasicTopicQuestionOverview
          question_index={index}
          sendOrderOfQuestionsToParent={getOrderOfQuestionsFromChild}
          question_title={question.question_title}
        />
      ))}

      <Button brand="primary" onClick={() => addQuestion()}>Add new question</Button>
    </GridForm>
  );
};

export default QuestionsForm;
