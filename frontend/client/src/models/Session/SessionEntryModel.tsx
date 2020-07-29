import { Instance, SnapshotIn, types } from 'mobx-state-tree';

import { TreeNodeModel } from '../Tree/TreeNodeModel';

export const SessionEntryDataModel = types.model({
  slider: types.maybe(types.model({
    value: types.number,
  })),
  textbox: types.maybe(types.model({
    value: types.string,
  })),
  register: types.maybe(types.model({
    value: types.string,
  })),
  choice: types.maybe(types.model({
    value: types.string,
  })),
});

const SessionEntryModel = types
  .model({
    node: types.reference(TreeNodeModel),
    data: types.optional(SessionEntryDataModel, {}),
  });

export interface SessionEntryDataProps extends Instance<typeof SessionEntryDataModel>{}
export interface SessionEntryDataInputProps extends SnapshotIn<typeof SessionEntryDataModel>{}
export interface SessionEntryProps extends Instance<typeof SessionEntryModel>{}

export default SessionEntryModel;
