import React, { useState, useContext, useEffect, ReactNode } from 'react';
import useQuestionnaire from './use-questionnaire';
import { getQuestionNodeQuery } from '../queries/getQuestionNodeQuery';
import client from '../config/apollo';
import { useHistory, useLocation } from 'react-router-dom';

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

export interface HAASEdge {
  id: string;
  parentNode: HAASNode;
  childNode: HAASNode;
  conditions: HAASNodeConditions[];
}

export interface HAASNode {
  id: string;
  nodeId?: number;
  title: string;
  branchVal?: string;
  conditions?: [HAASNodeConditions];
  questionType: string;
  type?: string;
  overrideLeaf?: HAASNode;
  options?: [MultiChoiceOption];
  children: [HAASNode];
  edgeChildren: [Edge];
}

interface HAASTreeContextProps {
  nodeHistoryStack: HAASNode[];
  edgeHistoryStack: HAASEdge[];
  entryHistoryStack: HAASEntry[];
  isAtLeaf: boolean;
  currentDepth: number;
  activeNode: HAASNode | null;
  addFormEntry: (formEntry: HAASFormEntry) => void;
  goToChild: (key: string | number, formEntry?: HAASFormEntry) => void;
}

export interface HAASEntry {
  nodeId: string | null;
  depth: number;
  edgeId?: string | null;
  data: HAASFormEntry;
}

export interface HAASFormEntry {
  textValue?: string | null;
  numberValue?: number | null;
  multiValues?: HAASFormEntry[];
}

const findNextEdge = (parent: HAASNode, key: string | number) => {
  const candidates = parent?.edgeChildren?.filter(edge => {
    if (parent.questionType === 'SLIDER') {
      if (edge?.conditions?.[0]?.renderMin && key < edge?.conditions?.[0].renderMin) {
        return false;
      }

      if (edge?.conditions?.[0]?.renderMax && key > edge?.conditions?.[0].renderMax) {
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

export const HAASTreeContext = React.createContext({} as HAASTreeContextProps);

export const HAASTreeProvider = ({ children }: { children: ReactNode }) => {
  const history = useHistory();
  const location = useLocation();

  const { questionnaire } = useQuestionnaire();
  const [leafCollection, setLeafCollection] = useState<HAASNode[]>([]);

  // Active trackables
  const [isAtLeaf, setIsAtLeaf] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [activeLeafNodeId, setActiveLeafNodeID] = useState('');
  const [activeNode, setActiveNode] = useState<HAASNode | null>(null);

  // History trackables
  const [entryHistoryStack, setEntryHistoryStack] = useState<HAASEntry[]>([]);
  const [nodeHistoryStack, setNodeHistoryStack] = useState<HAASNode[]>([]);
  const [edgeHistoryStack, setEdgeHistoryStack] = useState<HAASEdge[]>([]);

  // If questionnaire is initialized
  useEffect(() => {
    if (questionnaire) {
      setNodeHistoryStack(questionnaire?.questions || []);
      setActiveNode(questionnaire?.questions?.slice(0));
      setLeafCollection(questionnaire?.leafs || []);
    }
  }, [questionnaire, leafCollection]);

  const getActiveNode = () => {
    if (isAtLeaf) {
      const [leaf] = leafCollection.filter(leaf => leaf.id === activeLeafNodeId);
      return leaf || null;
    }

    return nodeHistoryStack.slice(-1)[0];
  };
  const getActiveEdge = () => edgeHistoryStack.slice(-1)[0];

  const addFormEntry = (formEntry: HAASFormEntry) => {
    setEntryHistoryStack(entries => [
      ...entries,
      {
        nodeId: getActiveNode().id,
        edgeId: getActiveEdge()?.id,
        depth: currentDepth,
        data: formEntry
      }
    ]);

    return entryHistoryStack;
  };

  const goToChild = async (key: string | number) => {
    const nextEdge: Edge = findNextEdge(nodeHistoryStack.slice(-1)[0], key);

    // Find next node
    const nextNode: any =
      nextEdge?.childNode?.id &&
      (await client
        .query({
          query: getQuestionNodeQuery,
          variables: {
            id: nextEdge?.childNode.id
          }
        })
        .then(res => res.data.questionNode));

    setCurrentDepth(depth => (depth += 1));

    // If next-node has an override-leaf
    if (nextNode && nextNode.overrideLeaf?.id) setActiveLeafNodeID(nextNode?.overrideLeaf?.id);

    if (!nextNode) {
      setIsAtLeaf(true);
    }

    // TODO: Can be this done better?
    // Track both nodes and edges traversed
    setActiveNode(nextNode);
    setNodeHistoryStack(hist => [...hist, nextNode]);
    setEdgeHistoryStack(hist => [...hist, nextEdge]);
  };

  return (
    <HAASTreeContext.Provider
      value={{
        entryHistoryStack,
        nodeHistoryStack,
        edgeHistoryStack,
        goToChild,
        isAtLeaf,
        activeNode,
        currentDepth,
        addFormEntry
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
