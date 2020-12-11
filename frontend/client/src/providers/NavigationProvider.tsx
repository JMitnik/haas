import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import { useHistory } from 'react-router-dom';
import useDialogueTree from './DialogueTreeProvider';

const STAY_LEAFS = ['LINK', 'SHARE'];

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
