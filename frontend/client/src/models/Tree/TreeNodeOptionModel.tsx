import { IAnyModelType, Instance, types } from 'mobx-state-tree';
import TreeNodeModel from './TreeNodeModel';

const TreeNodeOptionModel = types
  .model({
    id: types.identifierNumber,
    value: types.string,
    publicValue: types.maybeNull(types.string),
    overrideLeaf: types.maybe(types.reference(types.late((): IAnyModelType => TreeNodeModel))),
  });

export interface TreeNodeOptionProps extends Instance<typeof TreeNodeOptionModel>{}

export default TreeNodeOptionModel;
