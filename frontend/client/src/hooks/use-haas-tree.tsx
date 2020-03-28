import React, { useContext, ReactNode, useReducer } from 'react';
import { HAASNode, HAASEntry, Questionnaire, HAASEdge, HAASFormEntry } from './use-questionnaire';
import { getQuestionNodeQuery } from '../queries/getQuestionNodeQuery';
import client from '../config/apollo';

interface TreeDispatchProps {
  goToChild: (currentNode: HAASNode, key: string | number, newNodeFormEntry: HAASFormEntry) => void;
}

interface TreeProviderProps {
  questionnaire: Questionnaire;
  children: ReactNode;
}

type TreeAction = {
  type: 'goToChild';
  nextNode: HAASNode;
  nextEdge: HAASEdge;
  newNodeFormEntry: HAASFormEntry;
};

interface TreeStateProps {
  historyStack: HAASEntry[];
  isAtLeaf: boolean;
  currentDepth: number;
  activeNode: HAASNode;
  activeEdge: HAASEdge | null;
  activeLeaf: HAASNode;
}

const treeReducer = (state: TreeStateProps, action: TreeAction) => {
  switch (action.type) {
    case 'goToChild': {
      let activeLeaf = state.activeLeaf;

      if (action.nextNode.overrideLeaf) {
        activeLeaf = action.nextNode.overrideLeaf;
      }

      const newNodeEntry: HAASEntry = {
        depth: state.currentDepth,
        node: state.activeNode,
        edge: state.activeEdge,
        data: action.newNodeFormEntry
      };

      return {
        currentDepth: state.currentDepth + 1,
        activeNode: action.nextNode,
        isAtLeaf: state.isAtLeaf,
        activeEdge: action.nextEdge,
        activeLeaf: activeLeaf,
        historyStack: [...state.historyStack, newNodeEntry]
      };
    }
    default:
      return state;
  }
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
};

export const HAASTreeStateContext = React.createContext({} as TreeStateProps);
export const HAASTreeDispatchContext = React.createContext({} as TreeDispatchProps);

export const HAASTreeProvider = ({ questionnaire, children }: TreeProviderProps) => {
  const [state, dispatch] = useReducer(treeReducer, {
    currentDepth: 0,
    activeNode: questionnaire.questions[0],
    activeLeaf: questionnaire.leafs[0],
    activeEdge: null,
    isAtLeaf: false,
    historyStack: []
  });

  const goToChild = async (
    currentNode: HAASNode,
    key: string | number,
    nodeEntry: HAASFormEntry
  ) => {
    const nextEdge = findNextEdge(currentNode, key);
    const nextNode = await findNextNode(nextEdge);

    dispatch({ type: 'goToChild', nextNode, nextEdge, newNodeFormEntry: nodeEntry });
  };

  return (
    <HAASTreeStateContext.Provider value={state}>
      <HAASTreeDispatchContext.Provider value={{ goToChild }}>
        {children}
      </HAASTreeDispatchContext.Provider>
    </HAASTreeStateContext.Provider>
  );
};

const useHAASTreeState = () => {
  return useContext(HAASTreeStateContext);
};

const useHAASTreeDispatch = () => {
  return useContext(HAASTreeDispatchContext);
};

const useHAASTree = () => {
  return { treeState: useHAASTreeState(), treeDispatch: useHAASTreeDispatch() };
};

export default useHAASTree;
