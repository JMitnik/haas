import { Instance, types } from 'mobx-state-tree';

const SessionEntryModel = types
  .model({
    nodeId: types.string,
    data: types.optional(types.string, ''),
  });

export interface SessionEntryProps extends Instance<typeof SessionEntryModel>{}

export default SessionEntryModel;
