import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import { useHistory } from 'react-router-dom';
import useDialogueTree from './DialogueTreeProvider';

export const useNavigator = () => {
  const { store } = useDialogueTree();
  const history = useHistory();

  const routes = {
    start: `/${store.customer?.slug}/${store.tree?.slug}`,
    activeLeaf: `/${store.customer?.slug}/${store.tree?.slug}/n/${store.tree?.activeLeaf?.id}`,
  };

  const goToStart = () => {
    history.push(`/${store.customer?.slug}/${store.tree?.slug}`);
  };

  const goToActiveLeaf = () => history.push(routes.activeLeaf);

  const goToNodeByEdge = (edgeId: string) => history.push(`/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`);

  const goToPostLeafByEdge = (edgeId: string) => history.push(`/${store.customer?.slug}/${store.tree?.slug}/${edgeId}`);

  const checkIfReset = (currentNode: TreeNodeProps) => {
    const suddenlyStarted = !currentNode.isLeaf && !currentNode.isRoot && !store.hasStarted;
    const inPostLeafAfterRefresh = currentNode.isPostLeaf && !store.hasStarted;
    const inTreeWithNoResults = !currentNode.isLeaf && !currentNode.isRoot && store.session.isEmpty;

    return suddenlyStarted || inPostLeafAfterRefresh || inTreeWithNoResults;
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
