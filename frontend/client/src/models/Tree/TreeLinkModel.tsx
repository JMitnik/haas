import { Instance, types } from 'mobx-state-tree';

const TreeLinkModel = types
  .model({
    url: types.string,
    type: types.string,
    title: types.maybeNull(types.string),
    icon: types.maybeNull(types.string),
    backgroundColor: types.maybeNull(types.string),
  });

export interface TreeLinkProps extends Instance<typeof TreeLinkModel>{}

export default TreeLinkModel;
