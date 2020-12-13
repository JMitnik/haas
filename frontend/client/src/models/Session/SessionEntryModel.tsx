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
  form: types.maybe(types.model({
    values: types.array(types.maybe(types.model({
      relatedFieldId: types.string,
      email: types.maybe(types.string),
      phoneNumber: types.maybe(types.string),
      url: types.maybe(types.string),
      shortText: types.maybe(types.string),
      longText: types.maybe(types.string),
      number: types.maybe(types.number),
    }))),
  })),
});

const SessionEntryModel = types
  .model({
    node: types.reference(TreeNodeModel),
    data: types.optional(SessionEntryDataModel, {}),
  });

export interface SessionEntryDataProps extends Partial<Instance<typeof SessionEntryDataModel>>{}
export interface SessionEntryDataInputProps extends SnapshotIn<typeof SessionEntryDataModel>{}
export interface SessionEntryProps extends Partial<Instance<typeof SessionEntryModel>>{}

export default SessionEntryModel;
