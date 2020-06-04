import { defaultPostLeafNode } from 'models/Tree/TreeNodeModel';
import TreeStoreModel from 'models/TreeStoreModel';

const treeStore = TreeStoreModel.create({
  session: {},
  tree: null,
});

export default treeStore;
