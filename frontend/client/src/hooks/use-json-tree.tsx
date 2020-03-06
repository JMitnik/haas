import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { useQuestionnaire } from './use-questionnaire';
import { GET_QUESTION_NODE } from '../queries/getQuestionNode';
import client from '../config/ApolloClient'

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

export interface Edge {
  id: string;
  parentNode: HAASNode;
  childNode: HAASNode;
  conditions: [HAASNodeConditions];
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
  edgeChildren: [Edge];
}

interface JSONTreeContextProps {
  historyStack: HAASNode[];
  goToChild: (key: string | number) => void;
}


const findNextEdge = (parent: HAASNode, key: string | number) => {
  const candidates = parent?.edgeChildren?.filter(edge => {
    if (parent.questionType === 'SLIDER') {
      if (edge?.conditions?.[0].renderMin && key < edge?.conditions?.[0].renderMin) {
        return false;
      }

      if (edge?.conditions?.[0].renderMax && key > edge?.conditions?.[0].renderMax) {
        return false;
      }
    }
    if (parent.questionType === 'MULTI_CHOICE') {
      return edge.conditions?.[0].matchValue === key;
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

  const goToChild = async (key: string | number) => {
        let nextEdge: Edge = findNextEdge(historyStack.slice(-1)[0], key);
        console.log('NEXT EDGE: ', nextEdge)
        let nextNode: any = nextEdge?.childNode?.id && await client.query({
          query: GET_QUESTION_NODE,
          variables: {
            id: nextEdge?.childNode.id
          }
        }).then(res => res.data.questionNode)
    
        if (nextNode && nextNode.overrideLeaf?.id) {
          console.log('Setting active leafnode to: ', nextNode?.overrideLeaf?.id)
          setActiveLeafNodeID(nextNode?.overrideLeaf?.id);
        }
    
        if (!nextNode) {
          console.log('No next node going to look for leaf nodes')
          nextNode = findLeafNode(leafCollection, activeLeafNodeId);
        }
    
        setHistoryStack(hist => [...hist, nextNode]);
      };

  // const goToChild = (key: string | number) => {
  //   let nextNode: HAASNode = findNextNode(historyStack.slice(-1)[0], key);
  //   if (nextNode?.overrideLeaf?.id) {
  //     setActiveLeafNodeID(nextNode?.overrideLeaf?.id);
  //   }

  //   if (!nextNode) {
  //     nextNode = findLeafNode(leafCollection, activeLeafNodeId);
  //   }

  //   setHistoryStack(hist => [...hist, nextNode]);
  // };

  return (
    <JSONTreeContext.Provider value={{ historyStack, goToChild }}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => {
  return useContext(JSONTreeContext);
};
