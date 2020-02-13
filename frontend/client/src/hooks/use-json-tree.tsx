import React, { useState, useContext, ReactNode, useEffect, useCallback } from 'react';

export interface HAASNodeConditions {
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

type HAASQuestionNodeType = 'slider' | 'multi-choice' | 'text-box';
type HAASLeafType = 'textbox' | 'social-share' | 'registration' | 'phone';

export interface MultiChoiceOption {
  value: string;
  publicValue?: string;
}

export interface HAASNode {
  id: number;
  nodeId?: number;
  title: string;
  branchVal: string;
  conditions?: [HAASNodeConditions];
  type: HAASQuestionNodeType | HAASLeafType;
  questionType?: HAASQuestionNodeType | HAASLeafType;
  overrideLeafId?: number;
  options?: [MultiChoiceOption];
  children: [HAASNode];
}

interface JSONTreeContextProps {
  historyStack: HAASNode[];
  goToChild: (key: string | number) => void;
}

interface HAASRouterParams {
  nodeKey: string;
}

const findNextNode = (parent: HAASNode, key: string | number) => {
  console.log('Key: ', key)
  const candidates = parent?.children?.filter(child => {
    console.log('Child conditions: ', child?.conditions?.[0]);
    if (parent.questionType === 'slider') {
      if (child?.conditions?.[0].renderMin && key < child?.conditions?.[0].renderMin) {
        return false;
      }

      if (child?.conditions?.[0].renderMax && key > child?.conditions?.[0].renderMax) {
        return false;
      }
    }

    if (parent.questionType === 'multi-choice') {
      return child.conditions?.[0].matchValue === key;
    }

    return true;
  });

  console.log('candidates: ', candidates);

  return candidates && candidates[0];
};

const findLeafNode = (collection: HAASNode[], key: number) => collection.filter(item => item.nodeId === key)[0];

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {


  // console.log("old data: ", JSON.parse(JSON.stringify(json.rootQuestion)))

  const [activeLeafNodeId, setActiveLeafNodeID] = useState(0);
  // const [historyStack, setHistoryStack] = useState<HAASNode[]>([JSON.parse(JSON.stringify(json.rootQuestion))]);
  const [historyStack, setHistoryStack] = useState<HAASNode[]>(json.questionnaire);
  // console.log('history stack: ', historyStack)
  // const [activeNode, setActiveNode] = useState(historyStack.slice(0)[0]);
  const leafCollection: [HAASNode] = json.LeafCollection;

  const goToChild = (key: string | number) => {
    let nextNode: HAASNode = findNextNode(historyStack.slice(-1)[0], key);
    if (nextNode && nextNode.overrideLeafId) {
      setActiveLeafNodeID(nextNode.overrideLeafId);
    }

    if (!nextNode) {
      nextNode = findLeafNode(leafCollection, activeLeafNodeId);
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
