import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { getQuestionnaireQuery } from '../queries/getQuestionnaireQuery';
import { GET_QUESTIONNAIRE } from '../queries/getQuestionnaire';

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

  console.log('PARAMS: ', params)

  const res = useQuery(GET_QUESTIONNAIRE, {
    variables: {
      id: params.questionnaireId
    },
  });

  console.log(res.data)

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
