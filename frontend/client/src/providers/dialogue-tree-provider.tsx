import React, { useContext, ReactNode, useReducer } from 'react';
import { HAASNode, HAASEntry, HAASEdge, HAASFormEntry, Dialogue, CustomerProps } from 'types/generic';
import { getQuestionNodeQuery } from '../queries/getQuestionNodeQuery';
import client from '../config/apollo';

interface TreeDispatchProps {
  goToChild: (
    currentNode: HAASNode,
    key: string | number | null,
    newNodeFormEntry: HAASFormEntry
  ) => void;
}

interface TreeProviderProps {
  dialogue: Dialogue;
  customer: any;
  children: ReactNode;
}

type TreeAction =
  | {
      type: 'goToChild';
      nextNode: HAASNode | null;
      nextEdge: HAASEdge | null;
      newNodeFormEntry: HAASFormEntry;
    }
  | {
      type: 'finish';
    };

interface TreeStateProps {
  dialogue: Dialogue;
  historyStack: HAASEntry[];
  isAtLeaf: boolean;
  isFinished: boolean;
  currentDepth: number;
  activeNode: HAASNode;
  activeEdge: HAASEdge | null;
  activeLeaf: HAASNode;
  customer: CustomerProps;
}

const makeFinishedNode: () => HAASNode = () => ({
  id: '-1',
  children: [],
  title: 'Thank you for answering!',
  isRoot: false,
  type: 'FINISH'
});

/**
 * Reduces the tree state
 * @param state
 * @param action
 */
const treeReducer = (state: TreeStateProps, action: TreeAction): TreeStateProps => {
  switch (action.type) {
    case 'goToChild': {
      // Construct new node entry from form-entry
      const newNodeEntry: HAASEntry = {
        depth: state.currentDepth,
        node: state.activeNode,
        edge: state.activeEdge,
        data: action.newNodeFormEntry
      };

      const nextDepth = state.currentDepth + 1;

      // Check if next state has leaf to override
      let activeLeaf = state.activeLeaf;
      if (action.nextNode?.overrideLeaf) {
        activeLeaf = action.nextNode.overrideLeaf;
      }

      let nextNode = action.nextNode;

      // First check if we are already at leaf
      // if so override with final leaf, and
      let isFinished = state.isFinished;
      let isAtLeaf = state.isAtLeaf;
      if (isAtLeaf) {
        nextNode = makeFinishedNode();
        isFinished = true;
      }

      // If not, check if we arrive at leaf
      // if so override with leaf
      if (!nextNode) {
        nextNode = state.activeLeaf;
        isAtLeaf = true;
      }

      return {
        dialogue: state.dialogue,
        currentDepth: nextDepth,
        activeNode: nextNode,
        isFinished,
        isAtLeaf,
        activeEdge: action.nextEdge,
        customer: state.customer,
        activeLeaf,
        historyStack: [...state.historyStack, newNodeEntry]
      };
    }
    default:
      return state;
  }
};

/**
 * Finds the first outgoing edge from a parent that satisfies the key.
 */
const findNextEdge = (parent: HAASNode, key: string | number | null) => {
  if (!key) return null;

  const candidates = parent?.children?.filter((edge: any) => {
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

/**
 * Retrieves next node from the API based on its incoming edge.
 * @param edge
 */
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

  return null;
};

export const HAASTreeStateContext = React.createContext({} as TreeStateProps);
export const HAASTreeDispatchContext = React.createContext({} as TreeDispatchProps);

// Provider which manages the state of the context
export const DialogueTreeProvider = ({ dialogue, customer, children }: TreeProviderProps) => {
  console.log('Dialogue: ', dialogue);
  const [state, dispatch] = useReducer(treeReducer, {
    dialogue,
    currentDepth: 0,
    activeNode: dialogue.questions.filter((question) => question.isRoot)[0],
    activeLeaf: dialogue.leafs[0],
    activeEdge: null,
    isAtLeaf: false,
    isFinished: false,
    customer,
    historyStack: []
  });

  const goToChild = async (
    currentNode: HAASNode,
    key: string | number | null,
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

// Hook which extracts the context with the state variables
const useHAASTreeState = () => {
  return useContext(HAASTreeStateContext);
};

// Hook which extracts the context with the interactionable dispatches.
const useHAASTreeDispatch = () => {
  return useContext(HAASTreeDispatchContext);
};

// Hook which combines the dispatches and variables
const useHAASTree = () => {
  return { treeState: useHAASTreeState(), treeDispatch: useHAASTreeDispatch() };
};

export default useHAASTree;
