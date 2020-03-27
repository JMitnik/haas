import React from 'react';
import useQuestionnaire from 'hooks/use-questionnaire';
import { Loader } from '@haas/ui';
import { HAASTreeProvider } from 'hooks/use-haas-tree';
import QuestionnaireTree from './QuestionnaireTree/QuestionnaireTree';

const Questionnaire = () => {
  const { questionnaire } = useQuestionnaire();

  if (!questionnaire) return <Loader />;

  return (
    <>
      <HAASTreeProvider questionnaire={questionnaire}>
        <QuestionnaireTree />
      </HAASTreeProvider>
    </>
  );
};

export default Questionnaire;
