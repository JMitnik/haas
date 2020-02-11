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
  title: string;
  branchVal: string;
  conditions?: HAASNodeConditions;
  type: HAASQuestionNodeType | HAASLeafType;
  overrideLeafID?: number;
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
  const candidates = parent?.children?.filter(child => {
    if (parent.type === 'slider') {
      if (child?.conditions?.renderMin && key < child?.conditions?.renderMin) {
        return false;
      }

      if (child?.conditions?.renderMax && key > child?.conditions?.renderMax) {
        return false;
      }
    }

    if (parent.type === 'multi-choice') {
      return child.conditions?.matchValue === key;
    }

    return true;
  });

  return candidates && candidates[0];
};

const findLeafNode = (collection: HAASNode[], key: number) => collection.filter(item => item.id === key)[0];

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {
  const [activeLeafNodeId, setActiveLeafNodeID] = useState(0);
  const [historyStack, setHistoryStack] = useState<HAASNode[]>([JSON.parse(JSON.stringify(json.rootQuestion))]);
  const [activeNode, setActiveNode] = useState(historyStack.slice(0)[0]);
  const leafCollection: [HAASNode] = json.LeafCollection;

  const goToChild = (key: string | number) => {
    let nextNode: HAASNode = findNextNode(historyStack.slice(-1)[0], key);

    if (nextNode && nextNode.overrideLeafID) {
      setActiveLeafNodeID(nextNode.overrideLeafID);
    }

    if (!nextNode) {
      console.log(activeLeafNodeId);
      nextNode = findLeafNode(leafCollection, activeLeafNodeId);
      console.log(nextNode);
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
