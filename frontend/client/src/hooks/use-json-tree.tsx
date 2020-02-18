import React, { useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import client from '../ApolloClient'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GET_QUESTION_NODE } from '../queries/getQuestionNode';




export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

type HAASQuestionNodeType = 'slider' | 'multi-choice' | 'text-box';
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
}

export interface HAASNode {
  id: number;
  nodeId?: number;
  title: string;
  branchVal?: string;
  conditions?: [HAASNodeConditions];
  questionType: HAASQuestionType;
  overrideLeafId?: number;
  options?: [MultiChoiceOption];
  children: [HAASNode];
  edgeChildren: [Edge];
}

interface JSONTreeContextProps {
  historyStack: HAASNode[];
  goToChild: (key: string | number) => void;
}

interface HAASRouterParams {
  nodeKey: string;
}

const findNextEdge = (parent: HAASNode, key: string | number) => {
  const candidates = parent?.edgeChildren?.filter(edge => {
    if (parent.questionType.type === 'slider') {
      if (edge?.childNode?.conditions?.[0].renderMin && key < edge?.childNode?.conditions?.[0].renderMin) {
        return false;
      }

      if (edge?.childNode?.conditions?.[0].renderMax && key > edge?.childNode?.conditions?.[0].renderMax) {
        return false;
      }
    }

    if (parent.questionType.type === 'multi-choice') {
      return edge.childNode?.conditions?.[0].matchValue === key;
    }

    return true;
  });

  console.log('Candidates: ', candidates)
  return candidates && candidates[0];
};

const findLeafNode = (collection: HAASNode[], key: number) => collection.filter(item => item.nodeId === key)[0];

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {

  const [activeLeafNodeId, setActiveLeafNodeID] = useState(0);

  const [historyStack, setHistoryStack] = useState<HAASNode[]>(json.questionnaire);
  const leafCollection: [HAASNode] = json.LeafCollection;

  const goToChild = async (key: string | number) => {
    let nextEdge: Edge = findNextEdge(historyStack.slice(-1)[0], key);

    let nextNode: any = nextEdge?.childNode?.id && await client.query({
      query: GET_QUESTION_NODE,
      variables: {
        id: nextEdge?.childNode.id
      }
    }).then(res => res.data.questionNode)

    if (nextNode && nextNode.overrideLeafId) {
      setActiveLeafNodeID(nextNode.overrideLeafId);
    }

    if (!nextNode) {
      nextNode = findLeafNode(leafCollection, activeLeafNodeId);
      console.log('Leaf node: ', nextNode)
    }

    setHistoryStack(hist => [...hist, nextNode]);
  };

  console.log(historyStack);

  return (
    <JSONTreeContext.Provider value={{ historyStack, goToChild }}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => {
  return useContext(JSONTreeContext);
};
