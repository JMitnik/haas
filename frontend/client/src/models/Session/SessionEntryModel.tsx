import { IAnyModelType, Instance, types } from 'mobx-state-tree';

import { TreeNodeModel } from '../Tree/TreeNodeModel';

export const SessionEntryDataModel = types.model({
  numberValue: types.maybeNull(types.number),
  textValue: types.maybeNull(types.string),
  multiValues: types.maybeNull(types.array(types.late((): IAnyModelType => SessionEntryDataModel))),
});

const SessionEntryModel = types
  .model({
    node: types.reference(TreeNodeModel),
    data: types.optional(SessionEntryDataModel, {}),
  });

export interface SessionEntryDataProps extends Instance<typeof SessionEntryDataModel>{}
export interface SessionEntryProps extends Instance<typeof SessionEntryModel>{}

export default SessionEntryModel;
