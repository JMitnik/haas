import { useHistory } from 'react-router-dom';
import useDialogueTree from './DialogueTreeProvider';

export const useNavigator = () => {
  const store = useDialogueTree();
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

  return {
    routes,
    goToStart,
    goToPostLeafByEdge,
    goToNodeByEdge,
    goToActiveLeaf,
  };
};
