import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { useQuestionnaire } from './use-questionnaire';
import { getQuestionNodeQuery } from '../queries/getQuestionNodeQuery';
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
  getActiveLeaf: () => HAASNode | null;
  goToChild: (key: string | number, formEntry?: HAASFormEntry) => void;
}

export interface HAASEntry {
  nodeId: string | null;
  depth: number;
  edgeId?: string | null;
  data: HAASFormEntry;
};

export interface HAASFormEntry {
  textValue?: string | null;
  numberValue?: number | null;
  multiValue?: HAASFormEntry[];
};

const findNextEdge = (parent: HAASNode, key: string | number) => {
  const candidates = parent?.edgeChildren?.filter(edge => {
    if (parent.questionType === 'SLIDER') {
      if (edge?.conditions?.[0]?.renderMin && edge?.conditions?.[0]?.renderMin * 100 && key < edge?.conditions?.[0].renderMin * 100) {
        return false;
      }

      if (edge?.conditions?.[0]?.renderMax && edge?.conditions?.[0].renderMax * 100 && key > edge?.conditions?.[0].renderMax * 100) {
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
  const { questionnaire } = useQuestionnaire();
  const [leafCollection, setLeafCollection] = useState<HAASNode[]>([]);

  // Active trackables
  const [isAtLeaf, setIsAtLeaf] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [activeLeafNodeId, setActiveLeafNodeID] = useState("");

  // History trackables
  const [entryHistoryStack, setEntryHistoryStack] = useState<HAASEntry[]>([]);
  const [nodeHistoryStack, setNodeHistoryStack] = useState<HAASNode[]>([]);
  const [edgeHistoryStack, setEdgeHistoryStack] = useState<HAASEdge[]>([]);

  // If questionnaire is initialized
  useEffect(() => {
    if (questionnaire) {
      setNodeHistoryStack(questionnaire?.questions || []);
      setLeafCollection(questionnaire?.leafs || []);
    }
  }, [questionnaire, leafCollection]);

  const getActiveNode = () => nodeHistoryStack.slice(-1)[0];
  const getActiveEdge = () => edgeHistoryStack.slice(-1)[0];

  const goToChild = async (key: string | number, formEntry?: HAASFormEntry) => {
    if (formEntry) {
      setEntryHistoryStack(entries => ([...entries, {
        nodeId: getActiveNode().id,
        edgeId: getActiveEdge()?.id,
        depth: currentDepth,
        data: formEntry,
      }]));
    }

    let nextEdge: Edge = findNextEdge(nodeHistoryStack.slice(-1)[0], key);

    // Find next node
    let nextNode: any = nextEdge?.childNode?.id && await client.query({
      query: getQuestionNodeQuery,
      variables: {
        id: nextEdge?.childNode.id
      }
    }).then(res => res.data.questionNode)

    // If next-node has an override-leaf
    if (nextNode && nextNode.overrideLeaf?.id) setActiveLeafNodeID(nextNode?.overrideLeaf?.id);

    if (!nextNode) {
      setIsAtLeaf(true);
      return;
    }

    setCurrentDepth(depth => depth += 1);

    // TODO: Can be this done better?
    // Track both nodes and edges traversed
    setNodeHistoryStack(hist => [...hist, nextNode]);
    setEdgeHistoryStack(hist => [...hist, nextEdge]);
  };

  const getActiveLeaf = () => {
    const [leaf] = leafCollection.filter(leaf => leaf.id === activeLeafNodeId);

    return leaf;
  };

  return (
    <HAASTreeContext.Provider value={{ entryHistoryStack, nodeHistoryStack, edgeHistoryStack, goToChild, isAtLeaf, getActiveLeaf, currentDepth }}>
      {children}
    </HAASTreeContext.Provider>
  );
};

export const useHAASTree = () => {
  return useContext(HAASTreeContext);
};
