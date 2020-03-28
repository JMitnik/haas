import React, { useState, useContext, useEffect, ReactNode, useDebugValue } from 'react';
import useQuestionnaire, {
  HAASNode,
  HAASEntry,
  HAASFormEntry,
  Questionnaire,
  HAASEdge,
  Edge
} from './use-questionnaire';
import { getQuestionNodeQuery } from '../queries/getQuestionNodeQuery';
import client from '../config/apollo';
import { useHistory, useLocation, useParams } from 'react-router-dom';

export const HAASTreeContext = React.createContext({} as HAASTreeContextProps);

interface HAASTreeContextProps {
  historyStack: HAASEntry[];
  isAtLeaf: boolean;
  currentDepth: number;
  activeNode: HAASNode | null;
  saveNodeEntry: (formEntry: HAASFormEntry) => void;
  goToChild: (key: string | number, formEntry?: HAASFormEntry) => void;
}

interface TreeProviderProps {
  questionnaire: Questionnaire;
  children: ReactNode;
}

interface ParamsProps {
  customerId: string;
  questionnaireId: string;
}

export const HAASTreeProvider = ({ questionnaire, children }: TreeProviderProps) => {
  const history = useHistory();
  const params = useParams<ParamsProps>();

  const [isAtLeaf, setIsAtLeaf] = useState<boolean>(false);
  const [currentDepth, setCurrentDepth] = useState<number>(0);

  // Three trackables
  const [activeLeaf, setActiveLeaf] = useState<HAASNode>(questionnaire.leafs[0]);
  const [activeEdge, setActiveEdge] = useState<HAASEdge | null>(null);

  // TODO: Set on the rootQuestion
  const [activeNode, setActiveNode] = useState<HAASNode>(questionnaire.questions[0]);
  useDebugValue(activeNode.id);

  // History of user's interaction
  const [historyStack, setHistoryStack] = useState<HAASEntry[]>([]);

  const saveNodeEntry = (formEntry: HAASFormEntry) => {
    setHistoryStack(entries => [
      ...entries,
      {
        node: activeNode,
        edge: activeEdge,
        depth: currentDepth,
        data: formEntry
      }
    ]);
  };

  const findNextEdge = (parent: HAASNode, key: string | number) => {
    const candidates = parent?.edgeChildren?.filter(edge => {
      if (parent.type === 'SLIDER') {
        if (edge?.conditions?.[0]?.renderMin && key < edge?.conditions?.[0].renderMin) {
          return false;
        }

        if (edge?.conditions?.[0]?.renderMax && key > edge?.conditions?.[0].renderMax) {
          return false;
        }
      }

      if (parent.type === 'MULTI_CHOICE') {
        return edge.conditions?.[0].matchValue === key;
      }

      return true;
    });

    return candidates && candidates[0];
  };

  const findNextNode = async (edge: HAASEdge | null) => {
    if (edge?.childNode?.id) {
      const { data: nextNodeData } = await client.query({
        query: getQuestionNodeQuery,
        variables: {
          id: edge?.childNode.id
        }
      });

      return nextNodeData.questionNode;
    }

    // Means we are at leaf
    setIsAtLeaf(true);
    return activeLeaf;
  };

  const findNewActiveLeaf = (node: HAASNode) => {
    const newLeaf = node?.overrideLeaf;

    if (newLeaf) {
      setActiveLeaf(newLeaf);
    }
  };

  const goToChild = async (key: string | number) => {
    setCurrentDepth(depth => (depth += 1));

    const nextEdge: Edge = findNextEdge(activeNode, key) || null;

    const nextNode = await findNextNode(nextEdge);
    findNewActiveLeaf(nextNode);

    setActiveNode(nextNode);
  };

  return (
    <HAASTreeContext.Provider
      value={{
        historyStack,
        goToChild,
        isAtLeaf,
        activeNode,
        currentDepth,
        saveNodeEntry
      }}
    >
      {children}
    </HAASTreeContext.Provider>
  );
};

const useHAASTree = () => {
  return useContext(HAASTreeContext);
};

export default useHAASTree;
