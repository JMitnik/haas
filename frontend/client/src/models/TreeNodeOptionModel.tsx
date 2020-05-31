import { Instance, types } from 'mobx-state-tree';

const TreeNodeOptionModel = types
  .model({
    id: types.identifierNumber,
    value: types.string,
    publicValue: types.optional(types.string, ''),
  });

export interface TreeEdgeConditionProps extends Instance<typeof TreeNodeOptionModel>{}

export default TreeNodeOptionModel;
