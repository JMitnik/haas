import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { getQuestionnaireQuery } from '../queries/getQuestionnaireQuery';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

type HAASQuestionType =
  | 'SLIDER'
  | 'MULTI_CHOICE'
  | 'TEXTBOX'
  | 'SOCIAL-SHARE'
  | 'REGISTRATION'
  | 'FINISH';

export interface MultiChoiceOption {
  value: string;
  publicValue?: string;
}

export interface Edge {
  id: string;
  parentNode: HAASNode;
  childNode: HAASNode;
  conditions: [HAASNodeConditions];
}

export interface HAASEdge {
  id: string;
  parentNode: HAASNode;
  childNode: HAASNode;
  conditions: HAASNodeConditions[];
}

export interface HAASNode {
  id: string;
  title: string;
  type: HAASQuestionType;
  children: Array<HAASNode>;
  edgeChildren: Array<Edge>;
  nodeId?: number;
  branchVal?: string;
  conditions?: [HAASNodeConditions];
  overrideLeaf?: HAASNode;
  options?: [MultiChoiceOption];
}

export interface HAASEntry {
  node: HAASNode;
  edge?: HAASEdge | null;
  data: HAASFormEntry;
  depth: number;
}

export interface HAASFormEntry {
  textValue?: string | null;
  numberValue?: number | null;
  multiValues?: HAASFormEntry[];
}

export interface Questionnaire {
  questions: HAASNode[];
  leafs: HAASNode[];
  rootQuestion: HAASNode;
}

interface QuestionnaireContextProps {
  customer: any;
  questionnaire?: Questionnaire | null;
}

interface ProjectParamProps {
  customerId: string;
  questionnaireId: string;
}

export const QuestionnaireContext = React.createContext({} as QuestionnaireContextProps);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams<ProjectParamProps>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>();
  const [customer, setCustomer] = useState();

  const res = useQuery(getQuestionnaireQuery, {
    variables: {
      id: params.questionnaireId
    }
  });

  const { data } = res;

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

const useQuestionnaire = () => useContext(QuestionnaireContext);

export default useQuestionnaire;
