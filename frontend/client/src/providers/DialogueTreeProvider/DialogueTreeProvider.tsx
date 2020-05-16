import React, { useContext, useReducer, useEffect } from 'react';
import gql from 'graphql-tag';
import { HAASNode, HAASEntry, HAASEdge, HAASFormEntry } from 'types/generic';
import { getQuestionNodeQuery } from '../../queries/getQuestionNodeQuery';
import client from '../../config/apollo';
import useProject from 'providers/ProjectProvider/ProjectProvider';
import { TreeStateProps, TreeAction, TreeDispatchProps } from './DialogueTreeProviderTypes';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import { EdgeFragment } from 'queries/EdgeFragment';
import { QuestionFragment } from 'queries/QuestionFragment';
import { ShallowNodeFragment } from 'queries/ShallowNodeFragment';

const defaultActiveLeaf: HAASNode = {
  id: '-1',
  type: 'FINISH',
  title: 'Thank you for participating!',
  children: [],
};

const defaultTreeState: TreeStateProps = {
  historyStack: [],
  currentDepth: 0,
  activeLeaf: defaultActiveLeaf,
  isAtLeaf: false,
  isFinished: false,
};

const makeFinishedNode: () => HAASNode = () => ({
  id: '-1',
  children: [],
  title: 'Thank you for answering!',
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
        node: action.payload.currentNode,
        data: action.payload.nodeEntry
      };

      const nextDepth = state.currentDepth + 1;

      // Check if next state has leaf to override
      const activeLeaf = state.activeLeaf;
      // if (action.nextNode?.overrideLeaf) {
      //   activeLeaf = action.nextNode.overrideLeaf;
      // }

      // let nextNode = action.nextNode;

      // First check if we are already at leaf
      // if so override with final leaf, and
      let isFinished = state.isFinished;
      const isAtLeaf = state.isAtLeaf;
      if (isAtLeaf) {
        // nextNode = makeFinishedNode();
        isFinished = true;
      }

      // If not, check if we arrive at leaf
      // if so override with leaf
      // if (!nextNode) {
      //   nextNode = state.activeLeaf;
      //   isAtLeaf = true;
      // }

      return {
        ...state,
        currentDepth: nextDepth,
        isFinished,
        isAtLeaf,
        activeLeaf,
        historyStack: [...state.historyStack, newNodeEntry]
      };
    }

    case 'startTree':
      return {
        ...state,
        currentDepth: 1,
      };

    case 'resetTree':
      return defaultTreeState;

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
export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(treeReducer, defaultTreeState);
  const history = useHistory();
  const client = useApolloClient();
  const {customer, dialogue} = useProject();
  const edgeMatch = useRouteMatch<{ companySlug: string, projectId: string, edgeId: string }>('/:companySlug/:projectId/:edgeId?');

  // Start the tree project
  useEffect(() => {
    // TODO: #113 Decide what to do if customer can be found but dialogue can't.
    if (dialogue && customer) {
      dispatch({ type: 'startTree', payload: { rootNode: dialogue.rootQuestion } })
    }
  }, [customer, dialogue]);

  const goToChild = async (
    currentNode: HAASNode,
    key: string | number | null,
    nodeEntry: HAASFormEntry
  ) => {
    const nextEdge = findNextEdge(currentNode, key);
    dispatch({ type: 'goToChild', payload: { currentNode, nodeEntry } });

    if (edgeMatch && nextEdge) {
      history.push(`/${edgeMatch.params.companySlug}/${edgeMatch.params.projectId}/${nextEdge?.id}`)
      return;
    }

    if (edgeMatch && !nextEdge) {
      history.push(`/${edgeMatch.params.companySlug}/${edgeMatch.params.projectId}/leaf/${state.activeLeaf.id}`)
      return;
    }
  };

  const getActiveNode = (edgeId?: string) => {
    if (dialogue && edgeId) {
      const data = client.readQuery({
        query: gql`
          query edge {
            edge(id: ${edgeId}) {
              childNode {
                ...QuestionFragment
              }
            }
          }

          ${QuestionFragment}
        `
      });

      return data?.edge?.childNode;
    }

    return dialogue?.rootQuestion;
  }

  const getActiveLeaf = (leafId: string) => {
    if (dialogue && leafId) {
      // TODO: #115 Resolve this nicer
      if (leafId === "-1") {
        return defaultActiveLeaf;
      }

      const data = client.readQuery({
        query: gql`
          query questionNode($id: ID!) {
            questionNode(id: $id) {
              id
              title
              type
            }
          }
        `,
        variables: {
          id: leafId
        }
      });

      console.log(data);
      return data.questionNode;
    }

    return null;
  };

  return (
    <HAASTreeStateContext.Provider value={state}>
      <HAASTreeDispatchContext.Provider value={{ goToChild, getActiveNode, getActiveLeaf }}>
        {children}
      </HAASTreeDispatchContext.Provider>
    </HAASTreeStateContext.Provider>
  );
};

// Hook which extracts the context with the state variables
const useDialogueTreeState = () => {
  return useContext(HAASTreeStateContext);
};

// Hook which extracts the context with the interactionable dispatches.
const useDialogueTreeDispatch = () => {
  return useContext(HAASTreeDispatchContext);
};

// Hook which combines the dispatches and variables
const useDialogueTree = () => {
  return { treeState: useDialogueTreeState(), treeDispatch: useDialogueTreeDispatch() };
};

export default useDialogueTree;
