import makeInspectable from 'mobx-devtools-mst';

import TreeStoreModel, { TreeStoreModelProps } from 'models/TreeStoreModel';

const treeStore = TreeStoreModel.create({
  session: {},
  tree: {},
});

makeInspectable(treeStore);

export default treeStore;
