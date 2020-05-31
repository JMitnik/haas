import { Instance, types } from 'mobx-state-tree';

import SessionModel from './SessionModel';
import TreeModel from './TreeModel';

const TreeStoreModel = types
  .model('TreeStore', {
    session: types.optional(SessionModel, {}),
    tree: TreeModel,
  });

export interface TreeStoreModelProps extends Instance<typeof TreeStoreModel>{}

export default TreeStoreModel;
