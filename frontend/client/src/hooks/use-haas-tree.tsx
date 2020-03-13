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
  formEntryStack: HAASEntry[];
  isAtLeaf: boolean;
  currentDepth: number;
  getActiveLeaf: () => HAASNode | null;
  goToChild: (key: string | number, formEntry?: HAASEntry) => void;
}

export interface HAASEntry {
  data: HAASEntryData
};

export interface HAASEntryData {
  nodeId: string | null;
  edgeId?: string | null;
  textValue?: string | null;
  numberValue?: number | null;
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

const findLeafNode = (collection: HAASNode[], key: string) => collection.filter(item => item.id === key)[0];

export const HAASTreeContext = React.createContext({} as HAASTreeContextProps);

export const HAASTreeProvider = ({ children }: { children: ReactNode }) => {
  const { questionnaire } = useQuestionnaire();

  const [isAtLeaf, setIsAtLeaf] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [activeLeafNodeId, setActiveLeafNodeID] = useState("");

  const [formEntryStack, setFormEntryStack] = useState<HAASEntry[]>([]);
  const [nodeHistoryStack, setNodeHistoryStack] = useState<HAASNode[]>([]);
  const [edgeHistoryStack, setEdgeHistoryStack] = useState<HAASEdge[]>([]);
  const [leafCollection, setLeafCollection] = useState<HAASNode[]>([]);

  // If questionnaire is initialized
  useEffect(() => {
    if (questionnaire) {
      setNodeHistoryStack(questionnaire?.questions || []);
      setLeafCollection(questionnaire?.leafs || []);
    }
  }, [questionnaire, leafCollection]);

  const goToChild = async (key: string | number, formEntry?: HAASEntry) => {
    if (formEntry) {
      setFormEntryStack(entries => [...entries, formEntry]);
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
    <HAASTreeContext.Provider value={{ formEntryStack, nodeHistoryStack, edgeHistoryStack, goToChild, isAtLeaf, getActiveLeaf, currentDepth }}>
      {children}
    </HAASTreeContext.Provider>
  );
};

export const useHAASTree = () => {
  return useContext(HAASTreeContext);
};
