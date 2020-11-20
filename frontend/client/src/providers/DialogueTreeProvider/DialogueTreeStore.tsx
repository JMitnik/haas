import TreeStoreModel from 'models/TreeStoreModel';

const treeStore = TreeStoreModel.create({
  session: {},
  tree: null,
  hasStarted: false,
});

export default treeStore;
