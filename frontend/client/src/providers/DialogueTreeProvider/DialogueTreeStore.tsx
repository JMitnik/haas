import makeInspectable from 'mobx-devtools-mst';

import { defaultPostLeafNode } from 'models/Tree/TreeNodeModel';
import TreeStoreModel from 'models/TreeStoreModel';

const treeStore = TreeStoreModel.create({
  session: {},
  tree: {
    activeLeaf: defaultPostLeafNode.id,
  },
});

makeInspectable(treeStore);

export default treeStore;
