import React, { useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

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
  setLeafID?: number;
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

export const JSONTreeContext = React.createContext({} as JSONTreeContextProps);

export const JSONTreeProvider = ({ json, children }: { json: any, children: ReactNode }) => {
  // Initialize the starting point
  const [activeNode, setActiveNode] = useState(json.rootQuestion);
  const [activeLeafNodeId, setActiveLeafNodeID] = useState(0);
  const [historyStack, setHistoryStack] = useState<HAASNode[]>([json.rootQuestion]);

  const leafCollection: [HAASNode] = json.LeafCollection;
  const history = useHistory();

  const goToChild = useCallback((key: string | number) => {
    const getLeafNode = () => leafCollection.filter(node => node.id === activeLeafNodeId)[0];

    const getNextChild = (key: string | number) => {
      let activeNode = historyStack.slice(-1)[0];

      const nextNode = activeNode.children?.filter((node: HAASNode) => {
        if (activeNode.type === 'slider') {
          if (node?.conditions?.renderMin && key < node?.conditions?.renderMin) {
            return false;
          }

          if (node?.conditions?.renderMax && key > node?.conditions?.renderMax) {
            return false;
          }
        }

        if (activeNode.type === 'multi-choice') {
          if (node.conditions?.matchValue === key) {
            return true;
          }

          return false;
        }

        return true;
      });

      // If there is no next node, return the current Leaf
      if (!nextNode || (nextNode && nextNode?.length === 0)) {
        const leafNode = getLeafNode();
        return leafNode;
      }

      return nextNode[0];
    };

    const nextNode = getNextChild(key);

      if (nextNode.setLeafID) {
        setActiveLeafNodeID(nextNode.setLeafID);
      }

      console.log("TCL: goToChild -> nextNode", nextNode);

      // Add node to browser-history
      history.push({
        search: `?nextNodeId=${nextNode.id}&?nextNodeKey=${key}`
      });

      // Add node to history-stack
      setHistoryStack([...historyStack, nextNode]);
  }, [historyStack, leafCollection, activeLeafNodeId ,history]);

  useEffect(() => {
    // Go back
    if (history.action === "POP") {
      setHistoryStack(histStack => {
        if (histStack.length <= 1) return [...histStack];
        return [...histStack.splice(0, histStack.length - 1)];
      });

      return;
    }
  }, [history.action, history.location]);

  return (
    <JSONTreeContext.Provider value={{ historyStack, goToChild }}>
      {children}
    </JSONTreeContext.Provider>
  );
};

export const useJSONTree = () => {
  return useContext(JSONTreeContext);
};
