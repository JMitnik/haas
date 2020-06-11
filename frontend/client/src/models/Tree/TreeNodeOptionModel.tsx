import { Instance, types } from 'mobx-state-tree';

const TreeNodeOptionModel = types
  .model({
    id: types.identifierNumber,
    value: types.string,
    publicValue: types.maybeNull(types.string),
  });

export interface TreeNodeOptionProps extends Instance<typeof TreeNodeOptionModel>{}

export default TreeNodeOptionModel;
