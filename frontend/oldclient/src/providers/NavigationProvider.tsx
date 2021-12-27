import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import { useHistory, useLocation } from 'react-router-dom';
import useDialogueTree from './DialogueTreeProvider';

const STAY_LEAFS = ['LINK', 'SHARE'];

export const useNavigator = () => {
  const { store } = useDialogueTree();
  const history = useHistory();
  const location = useLocation();

  const routes = {
    start: `/${store.customer?.slug}/${store.tree?.slug}`,
    // BUG: This does not get updated in the right order.
    activeLeaf: `/${store.customer?.slug}/${store.tree?.slug}/n/${store.tree?.activeLeaf?.id}`,
  };

  const goToStart = () => {
    history.push({
      pathname: `/${store.customer?.slug}/${store.tree?.slug}`,
      search: location.search,
    });
  };

  const goToActiveLeaf = () => history.push({
    pathname: `/${store.customer?.slug}/${store.tree?.slug}/n/${store.tree?.activeLeaf?.id}`,
    search: location.search,
  });

  const goToNodeByEdge = (edgeId: string) => history.push({
    pathname: `/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`,
    search: location.search,
  });

  const goToPostLeafByEdge = (edgeId: string) => history.push({
    pathname: `/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`,
    search: location.search,
  });

  const checkIfReset = (currentNode: TreeNodeProps) => {
    const suddenlyStarted = !currentNode.isLeaf && !currentNode.isRoot && !store.hasStarted;
    const inPostLeafAfterRefresh = currentNode.isPostLeaf && !store.hasStarted;
    const inTreeWithNoResults = !currentNode.isLeaf && !currentNode.isRoot && store.session.isEmpty;
    const suddenlyInLeaf = currentNode.isLeaf && !STAY_LEAFS.includes(currentNode.type) && !store.hasStarted;

    return suddenlyStarted || inPostLeafAfterRefresh || inTreeWithNoResults || suddenlyInLeaf;
  };

  return {
    routes,
    checkIfReset,
    goToStart,
    goToPostLeafByEdge,
    goToNodeByEdge,
    goToActiveLeaf,
  };
};
