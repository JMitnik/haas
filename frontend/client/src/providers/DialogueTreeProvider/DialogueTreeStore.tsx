import makeInspectable from 'mobx-devtools-mst';

import { defaultTreeLeaf } from 'models/TreeNodeModel';
import TreeStoreModel from 'models/TreeStoreModel';

const treeStore = TreeStoreModel.create({
  session: {},
  tree: {
    activeLeaf: defaultTreeLeaf.id,
  },
});

makeInspectable(treeStore);

export default treeStore;
