import { Instance, types } from 'mobx-state-tree';

const TreeShareModel = types
  .model({
    url: types.string,
    title: types.maybeNull(types.string),
    tooltip: types.maybeNull(types.string),
  });

export interface TreeShareProps extends Instance<typeof TreeShareModel>{}

export default TreeShareModel;
