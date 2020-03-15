import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { getQuestionnaireQuery } from '../queries/getQuestionnaireQuery';

interface QuestionnaireContextProps {
  customer: any;
  questionnaire: any;
}

interface ProjectParamProps {
  customerId: string;
  questionnaireId: string;
}

export const QuestionnaireContext = React.createContext({} as QuestionnaireContextProps);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams<ProjectParamProps>();
  
  const [questionnaire, setQuestionnaire] = useState();
  const [customer, setCustomer] = useState();
  const res = useQuery(getQuestionnaireQuery, {
    variables: {
      id: params.questionnaireId
    },
    onCompleted: (e) => {console.log(e)},
    onError: (e) => {console.log(e)}
  });

  const data = res.data;

  useEffect(() => {
    if (data?.questionnaire) {
      setQuestionnaire(data?.questionnaire);
      setCustomer(data?.questionnaire?.customer || {});
    }
  }, [data]);

  return (
    <QuestionnaireContext.Provider value={{ customer, questionnaire }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  return useContext(QuestionnaireContext);
};
