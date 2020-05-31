import { Instance, types } from 'mobx-state-tree';

import SessionEntryModel, { SessionEntryProps } from './SessionEntryModel';

const SessionModel = types
  .model({
    items: types.optional(types.array(SessionEntryModel), []),
  })
  .actions((self) => ({
    add(entry: SessionEntryProps) {
      self.items.push(entry);
    },
  }));

export interface EntryListProps extends Instance<typeof SessionModel>{}

export default SessionModel;
