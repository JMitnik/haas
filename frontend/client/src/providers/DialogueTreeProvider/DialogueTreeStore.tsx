import makeInspectable from 'mobx-devtools-mst';

import TreeStoreModel from 'models/TreeStoreModel';

const treeStore = TreeStoreModel.create({
  session: {},
  tree: {},
});

makeInspectable(treeStore);

export default treeStore;
