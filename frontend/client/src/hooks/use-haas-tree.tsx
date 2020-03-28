import React, {
  useState,
  useContext,
  useEffect,
  ReactNode,
  useDebugValue,
  useReducer
} from 'react';
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

interface HAASTreeStateContextProps {
  historyStack: HAASEntry[];
  isAtLeaf: boolean;
  currentDepth: number;
  activeNode: HAASNode | null;
}

interface HAASTreeDispatchContextProps {
  dispatch: Dispatch;
  goToChild: (dispatch: Dispatch, currentNode: HAASNode, key: string | number) => void;
}

export const HAASTreeStateContext = React.createContext({} as HAASTreeStateContextProps);
export const HAASTreeDispatchContext = React.createContext({} as HAASTreeDispatchContextProps);

interface TreeProviderProps {
  questionnaire: Questionnaire;
  children: ReactNode;
}

interface ParamsProps {
  customerId: string;
  questionnaireId: string;
}

type Action =
  | { type: 'addNodeEntry'; data: HAASEntry }
  | { type: 'goToChild'; nextNode: HAASNode; nextEdge: HAASEdge };
type Dispatch = (action: Action) => void;

type State = {
  currentDepth: number;
  isAtLeaf: boolean;
  activeNode: HAASNode;
  activeEdge?: HAASEdge | null;
  activeLeaf: HAASNode;
  historyStack: HAASEntry[];
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

const findNewActiveLeaf = (node: HAASNode) => node?.overrideLeaf;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'goToChild': {
      let activeLeaf = state.activeLeaf;

      if (action.nextNode.overrideLeaf) {
        activeLeaf = action.nextNode.overrideLeaf;
      }

      return {
        currentDepth: state.currentDepth + 1,
        activeNode: action.nextNode,
        isAtLeaf: state.isAtLeaf,
        activeEdge: action.nextEdge,
        activeLeaf: activeLeaf,
        historyStack: state.historyStack
      };
    }
    default:
      return state;
  }
};

const goToChild = async (dispatch: Dispatch, currentNode: HAASNode, key: string | number) => {
  const nextEdge = findNextEdge(currentNode, key);
  const nextNode = await findNextNode(nextEdge);
  dispatch({ type: 'goToChild', nextNode, nextEdge });
};

export const HAASTreeProvider = ({ questionnaire, children }: TreeProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    currentDepth: 0,
    activeNode: questionnaire.questions[0],
    activeLeaf: questionnaire.leafs[0],
    activeEdge: null,
    isAtLeaf: false,
    historyStack: []
  });

  return (
    <HAASTreeStateContext.Provider value={state}>
      <HAASTreeDispatchContext.Provider value={{ dispatch, goToChild }}>
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
