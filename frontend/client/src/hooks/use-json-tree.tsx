import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { getCustomerQuery } from '../queries/getCustomerQuery';
import { getQuestionnaireQuery } from '../queries/getQuestionnaireQuery';
import { useQuestionnaire } from './use-questionnaire';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

type HAASQuestionNodeType = 'SLIDER' | 'MULTI_CHOICE' | 'text-box';
type HAASLeafType = 'textbox' | 'social-share' | 'registration' | 'phone';

export interface HAASQuestionType {
    type: HAASQuestionNodeType | HAASLeafType;
}

export interface MultiChoiceOption {
  value: string;
  publicValue?: string;
}

export interface HAASNode {
  id: number;
  nodeId?: number;
  title: string;
  branchVal?: string;
  conditions?: [HAASNodeConditions];
  questionType: string;
  overrideLeaf?: HAASNode;
  options?: [MultiChoiceOption];
  children: [HAASNode];
}

interface JSONTreeContextProps {
  historyStack: HAASNode[];
  goToChild: (key: string | number) => void;
}


const findNextNode = (parent: HAASNode, key: string | number) => {
  const candidates = parent?.children?.filter(child => {
    if (parent.questionType === 'SLIDER') {
      if (child?.conditions?.[0].renderMin && key < child?.conditions?.[0].renderMin) {
        return false;
      }

      if (child?.conditions?.[0].renderMax && key > child?.conditions?.[0].renderMax) {
        return false;
      }
    }

    if (parent.questionType === 'MULTI_CHOICE') {
      return child.conditions?.[0].matchValue === key;
    }

    return true;
  });

  return candidates && candidates[0];
};

const findLeafNode = (collection: HAASNode[], key: number) => collection.filter(item => item.id === key)[0];

interface ProjectParamProps {
  customerId: string;
  questionnaireId: string;
}

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ children }: { children: ReactNode }) => {
  const { questionnaire } = useQuestionnaire();

  const [activeLeafNodeId, setActiveLeafNodeID] = useState(0);
  const [historyStack, setHistoryStack] = useState<HAASNode[]>([]);
  const [leafCollection, setLeafCollection] = useState([]);

  useEffect(() => {
    if (questionnaire) {
      setHistoryStack(questionnaire?.questions || []);
      setLeafCollection(questionnaire?.leafs || []);
    }
  }, [questionnaire]);

  const goToChild = (key: string | number) => {
    let nextNode: HAASNode = findNextNode(historyStack.slice(-1)[0], key);
    if (nextNode?.overrideLeaf?.id) {
      setActiveLeafNodeID(nextNode?.overrideLeaf?.id);
    }

    if (!nextNode) {
      nextNode = findLeafNode(leafCollection, activeLeafNodeId);
    }

    setHistoryStack(hist => [...hist, nextNode]);
  };

  return (
    <JSONTreeContext.Provider value={{ historyStack, goToChild }}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => {
  return useContext(JSONTreeContext);
};
