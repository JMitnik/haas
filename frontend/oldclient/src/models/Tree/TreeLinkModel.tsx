import { Instance, types } from 'mobx-state-tree';

const TreeLinkModel = types
  .model({
    url: types.string,
    type: types.string,
    title: types.maybeNull(types.string),
    iconUrl: types.maybeNull(types.string),
    backgroundColor: types.maybeNull(types.string),
    buttonText: types.maybeNull(types.string),
    header: types.maybeNull(types.string),
    subHeader: types.maybeNull(types.string),
    imageUrl: types.maybeNull(types.string),
  });

export interface TreeLinkProps extends Instance<typeof TreeLinkModel> { }

export default TreeLinkModel;
